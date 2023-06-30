import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioVerificaciones } from '../../servicios/verificaciones.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { Encuesta } from 'src/app/encuestas/modelos/Encuesta';
import { EncuestaComponent } from 'src/app/encuestas/componentes/encuesta/encuesta.component';

@Component({
  selector: 'app-pagina-reporte-verificar',
  templateUrl: './pagina-reporte-verificar.component.html',
  styleUrls: ['./pagina-reporte-verificar.component.css']
})
export class PaginaReporteVerificarComponent implements OnInit {
  @ViewChild('componenteEncuesta') componenteEncuesta!: EncuestaComponent
  encuesta?: Encuesta
  idVigilado?: string
  idEncuesta?: number
  idReporte?: number
  nit?: string
  razonSocial?: string
  estadoActual?: string
  clasificacionResolucion?: string
  constructor(private servicioVerificaciones: ServicioVerificaciones, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    combineLatest({
      params: this.activatedRoute.params,
      queryParams: this.activatedRoute.queryParams
    }).subscribe({
      next: (parametros) => {
        this.servicioVerificaciones.obtenerReporte(
          Number(parametros.queryParams['idEncuesta']), 
          Number(parametros.params['idReporte']),
          parametros.queryParams['idVigilado']
        ).subscribe({
          next: (encuesta)=>{
            this.encuesta = encuesta
            this.nit = parametros.queryParams['idVigilado']
            this.razonSocial = ''
            this.estadoActual = ''
            this.clasificacionResolucion = encuesta.clasificaion
            this.idEncuesta = Number(parametros.queryParams['idEncuesta'])
            this.idReporte = Number(parametros.params['idReporte'])
            this.idVigilado = parametros.queryParams['idVigilado']
          }
        })
      }
    })
  }

  guardarVerificaciones(){
    this.componenteEncuesta.guardarVerificaciones()
  }
}
