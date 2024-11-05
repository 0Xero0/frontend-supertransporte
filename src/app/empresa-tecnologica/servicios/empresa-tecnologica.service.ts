import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { EmpresaTecnologica } from '../modelos/EmpresaTecnologica';

@Injectable({
  providedIn: 'root'
})
export class EmpresaTecnologicaService extends Autenticable {
  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  listarEmpresas(){
    const endpoint = '/api/v1/empresas/listar'
    return this.http.get<EmpresaTecnologica[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  seleccionadas(){
    const endpoint = '/api/v1/empresas/seleccionadas'
    return this.http.get<EmpresaTecnologica[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  asignar(idEmpresa: string, fechaInicial: string, fechaFinal: string){
    const endpoint = `/api/v1/empresas/asignar`
    const formData = new FormData()
    formData.append('idEmpresa', idEmpresa)
    formData.append('fechaInicial', fechaInicial)
    formData.append('fechaFinal', fechaFinal)
    return this.http.post<EmpresaTecnologica[]>(`${this.host}${endpoint}`,formData, { headers: this.obtenerCabeceraAutorizacion() })
  }

  editar(seleccionadas: EmpresaTecnologica){
    const endpoint = `/api/v1/empresas/editar`
    const formData = new FormData()
    formData.append('idEmpresa', seleccionadas.idEmpresa)
    formData.append('fechaInicial', seleccionadas.fechaInicial)
    formData.append('fechaFinal', seleccionadas.fechaFinal)
    return this.http.put<EmpresaTecnologica[]>(`${this.host}${endpoint}`,formData, { headers: this.obtenerCabeceraAutorizacion() })
  }

  public activar(idEmpresa: string){
    const endpoint = `/api/v1/empresas/activar?idEmpresa=${idEmpresa}`
    return this.http.patch<EmpresaTecnologica[]>(`${this.host}${endpoint}`,undefined, { headers: this.obtenerCabeceraAutorizacion() })
  }
}
