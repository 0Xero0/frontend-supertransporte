import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ArchivoGuardado } from '../modelos/ArchivoGuardado';

@Injectable({
  providedIn: 'root'
})
export class ServicioArchivos extends Autenticable {
  private readonly host = environment.urlBackendArchivos

  constructor(private http: HttpClient) {
    super()
  }

  guardarArchivo(archivo: File, ruta: string, idVigilado: string): Observable<ArchivoGuardado>{
    const endpoint = '/api/v1/archivos'
    const formData = new FormData()
    formData.append('archivo', archivo)
    formData.append('idVigilado', idVigilado)
    formData.append('rutaRaiz', ruta)
    return this.http.post<ArchivoGuardado>(`${this.host}${endpoint}`, formData, { headers: { Authorization: `Bearer d4a32a3b-def6-4cc2-8f77-904a67360b53` } })
  }

}
