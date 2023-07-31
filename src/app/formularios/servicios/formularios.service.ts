import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { PeticionGuardarAspiranteTecnologico } from '../modelos/PeticionGuardarAspiranteTecnologico.ts';
import { Observable } from 'rxjs';
import { AspiranteTecnologico } from '../modelos/AspirateTecnologico.js';

@Injectable({
  providedIn: 'root'
})
export class ServicioFormularios extends Autenticable {
  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  enviarFormularioAspiranteTecnologico(formulario: PeticionGuardarAspiranteTecnologico): Observable<AspiranteTecnologico>{
    const endpoint = '/api/v1/formularios/aspirante_tecnologico'
    return this.http.post<AspiranteTecnologico>(`${this.host}${endpoint}`, formulario)
  }

}
