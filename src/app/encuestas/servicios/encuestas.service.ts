import { Injectable } from '@angular/core';
import { Encuesta } from '../modelos/Encuesta';
import { HttpClient } from '@angular/common/http';
import { ResumenReporte } from '../modelos/ResumenReporte';
import { environment } from 'src/environments/environment';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { RespuestaEnviar } from '../modelos/RespuestaEnviar';
import { Motivo } from '../modelos/Motivo';
import { Formulario } from '../modelos/Formulario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService extends Autenticable {

  private readonly host = environment.urlBackend
  private motivos: Motivo[] = []

  constructor(private http: HttpClient) {
    super()
    this.establecerMotivos()
  }

  obtenerEncuestas(pagina: number, limite: number, idUsuario: string, idEncuesta: number) {
    return this.http.get<{ reportadas: ResumenReporte[], paginacion: Paginacion }>(
      `${this.host}/api/v1/encuestas/listar?pagina=${pagina}&limite=${limite}&idVigilado=${idUsuario}&idEncuesta=${idEncuesta}`,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
    )
  }

  obtenerEncuesta(idVigilado: string, idEncuesta: number, idReporte: number) {
    return this.http.get<Encuesta>(
      `${this.host}/api/v1/encuestas/visualizar?idVigilado=${idVigilado}&idEncuesta=${idEncuesta}&idReporte=${idReporte}`,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
    )
  }

  obtenerEncuestaCuantitativa(): Observable<{formularios: Formulario[]}>{
    const endpoint = '/api/v1/inidicador/formularios'
    return this.http.get<{formularios: Formulario[]}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  guardarRespuesta(idReporte: number, peticion: { respuestas: RespuestaEnviar[] }) {
    const enpoint = `/api/v1/respuestas/${idReporte}`
    return this.http.post<{ mensaje: string }>(
      `${this.host}${enpoint}`,
      peticion,
      {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` }
      })
  }

  guardarRespuestasIndicadores(idReporte: number, respuestas: RespuestaEnviar[]){
    const endpoint = `/api/v1/inidicador/respuestas`
    return this.http.post(`${this.host}${endpoint}`, { reporteId: idReporte, respuestas }, {
      headers: this.obtenerCabeceraAutorizacion()
    })
  }

  enviarRespuesta(idEncuesta: number, idReporte: number, idVigilado: string) {
    const enpoint = `/api/v1/encuestas/enviar`
    return this.http.post<{ mensaje: string }>(
      `${this.host}${enpoint}`,
      { idEncuesta, idReporte, idVigilado },
      {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` }
      })
  }

  enviarRespuestaIndicadores(idEncuesta: number, idReporte: number, idVigilado: string){
    
  }

  establecerMotivos(): void {
    const endpoint = '/api/v1/encuestas/listar-motivo'
    this.http.get<Motivo[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() }).subscribe({
      next: (motivos)=>{
        this.motivos = motivos
      }
    })
  }

  obtenerMotivos(): Motivo[] {
    return this.motivos
  }

  exportarExcel(idReporte: number){
    const endpoint = `/api/v1/exportar/encuesta?idReporte=${idReporte}`
    return this.http.get(`${this.host}${endpoint}`, { 
      headers: this.obtenerCabeceraAutorizacion(),
      responseType: 'blob',
    })
  }

}
