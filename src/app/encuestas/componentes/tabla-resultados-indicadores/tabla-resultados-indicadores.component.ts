import { Component, Input, OnInit } from '@angular/core';
import { ResultadosIndicadores } from '../../modelos/ResultadosIndicadores';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
//import { ActivatedRoute } from '@angular/router';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { Encuesta } from 'src/app/encuestas/modelos/Encuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioVerificaciones } from 'src/app/verificaciones/servicios/verificaciones.service';

@Component({
  selector: 'app-tabla-resultados-indicadores',
  templateUrl: './tabla-resultados-indicadores.component.html',
  styleUrls: ['./tabla-resultados-indicadores.component.css']
})
export class TablaResultadosIndicadoresComponent implements OnInit {
  resultadosIndicadores?: ResultadosIndicadores
  
  noObligado: boolean = false
  encuesta?: Encuesta
  idVigilado?: string
  idEncuesta?: number
  idReporte?: number
  camposDeVerificacion: boolean = true
  camposDeVerificacionVisibles: boolean = true
  soloLectura: boolean = true
  hayCambios: boolean = false
  nit?: string
  razonSocial?: string
  estadoActual?: string
  clasificacionResolucion?: string

  esUsuarioAdministrador: boolean;
  observacionAdmin?: string
  aprobado?: boolean
  rol: Rol | null

  constructor(
    private servicioEncuesta: ServicioEncuestas, private route: ActivatedRoute,
    private servicioLocalStorage: ServicioLocalStorage,
    private activatedRoute: ActivatedRoute,
    private servicioVerificaciones: ServicioVerificaciones,
  ){ this.rol = this.servicioLocalStorage.obtenerRol()
    this.esUsuarioAdministrador = this.rol!.id === '001' ? true : false;}

  ngOnInit(): void {
    combineLatest({
      params: this.activatedRoute.params,
      queryParams: this.activatedRoute.queryParams
    }).subscribe({
      next: (parametros) => {
        this.servicioVerificaciones.obtenerReporte(
          Number(parametros.queryParams['idEncuesta']),
          this.idReporte = parametros.queryParams['idReporte'] || '',
          parametros.queryParams['idVigilado']
        ).subscribe({
          next: (encuesta)=>{
            this.encuesta = encuesta
            this.nit = parametros.queryParams['idVigilado']
            this.razonSocial = ''
            this.estadoActual = ''
            this.clasificacionResolucion = encuesta.clasificaion
            this.idEncuesta = Number(parametros.queryParams['idEncuesta'])
            this.idReporte = parametros.queryParams['idReporte'] || '',
            this.idVigilado = parametros.queryParams['idVigilado']
            this.soloLectura = !encuesta.encuestaEditable
            this.camposDeVerificacion = encuesta.verificacionEditable
            this.camposDeVerificacionVisibles = encuesta.verificacionVisible
            this.noObligado = encuesta.noObligado
          }
        })
      }
    })

    this.route.queryParams.subscribe(params => {
      this.idReporte = params['idReporte'] || '';
      this.idVigilado = params['idVigilado'] || '';
    });
    this.servicioEncuesta.obtenerResultadosIndicadores(this.idReporte,this.idVigilado).subscribe({
      next: (resultados)=>{
        this.resultadosIndicadores = resultados
      }
    })
  }
  formatoPorcentajes(porcentaje: number){
    if(porcentaje % 1==0){
      return porcentaje
    }else{
      return porcentaje.toFixed(2)
    }
  }

}
