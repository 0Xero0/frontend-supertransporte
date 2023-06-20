import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { Verificador } from '../modelos/Verificador';
import { ResumenReporte } from 'src/app/encuestas/modelos/ResumenReporte';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Asignacion } from '../modelos/Asignacion';

@Injectable({
  providedIn: 'root'
})
export class ServicioReportes extends Autenticable {

  private readonly host = environment.urlBackend 

  constructor(private http: HttpClient) { 
    super()
  }

  obtenerVerificadores(){
    const endpoint = `/api/v1/reportes/verificadores`
    return this.http.get<Verificador[]>(
      `${this.host}${endpoint}`,
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  obtenerRepostesAsignados(identificacionVerificador: string){
    const endpoint = `/api/v1/reportes/asignados/${identificacionVerificador}`
    return this.http.get<{ reportadas: ResumenReporte[], paginacion: Paginacion}>(
      `${this.host}${endpoint}`,
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  eliminarAsignacion(numeroReporte: number){
    const endpoint = `/api/v1/reportes/asignacion/${numeroReporte}`
    return this.http.delete(
      `${this.host}${endpoint}`,
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  asignarReportes(asignaciones: Asignacion[]){
    const endpoint = '/api/v1/reportes/asignacion'
    return this.http.post(
      `${this.host}${endpoint}`,
      asignaciones,
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }
}
