import { Component, OnInit } from '@angular/core';
import { ServicioVerificaciones } from '../../servicios/verificaciones.service';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ResumenReporteAsignado } from '../../modelos/ResumenReporteAsignado';
import { FiltrosUsuarios } from 'src/app/usuarios/modelos/FiltrosUsuarios';

@Component({
  selector: 'app-pagina-reportes-verificar',
  templateUrl: './pagina-reportes-verificar.component.html',
  styleUrls: ['./pagina-reportes-verificar.component.css']
})
export class PaginaReportesVerificarComponent implements OnInit{
  paginador: Paginador<FiltrosUsuarios>
  reportes: ResumenReporteAsignado[] = []

  constructor(private servicioVerifiaciones: ServicioVerificaciones){
    this.paginador = new Paginador<any>(this.obtenerReportes)
  }
  
  ngOnInit(): void {
    this.paginador.inicializar()
  }

  obtenerReportes = (pagina: number, limite: number, filtros?: any) =>{
    return new Observable<Paginacion>((subscripcion) => {
      this.servicioVerifiaciones.obtenerReportes(pagina, limite, filtros).subscribe({
        next: (respuesta) =>{
          this.reportes = respuesta.asignadas
          subscripcion.next(respuesta.paginacion)
        }
      })
    })
  }
}
