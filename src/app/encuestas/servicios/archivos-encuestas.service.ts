import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { ArchivoTemporal } from '../modelos/ArchivoTemporal';
import { catchError, throwError } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ServicioArchivosEncuestas extends Autenticable {

  private readonly host = environment.urlBackendArchivos;
  private readonly token = environment.tokenBackendArchivos;

  constructor(private http: HttpClient) { 
    super()
  }

  guardarArchivoTemporal(archivo: File, idVigilado: string, idPregunta: number, evidencia: boolean = false){
    const endpoint = '/api/v1/archivos'
    const formData = new FormData()
    formData.append('archivo', archivo)
    formData.append('idPregunta', idPregunta.toString())
    formData.append('idVigilado', idVigilado.toString())
    formData.append('rutaRaiz', !evidencia ? 'pesv' : 'evidencias')
    formData.append('temporal', 'true')
    return this.http.post<ArchivoTemporal>(
        `${this.host}${endpoint}`, 
        formData, 
        { headers: { Authorization: `Bearer d4a32a3b-def6-4cc2-8f77-904a67360b53` } }
    )
  }

  descargarArchivo(nombreArchivo: string, ruta: string, nombreOriginal: string){
    this.http.get<{archivo: string}>(
      `${this.host}/api/v1/archivos?nombre=${nombreArchivo}&ruta=${ruta}`,
      { headers: {Authorization: `Bearer ${this.token}`} }
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al descargar el archivo:', error);
        return throwError('Error al descargar el archivo.');
      })
    )
    .subscribe((respuesta) => {
      const blob = this.b64toBlob(respuesta.archivo)
      saveAs(blob, nombreOriginal);
    });
  }

  //stack overflow :D
  private b64toBlob(b64Data: string, contentType='', sliceSize = 512): Blob{
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}
