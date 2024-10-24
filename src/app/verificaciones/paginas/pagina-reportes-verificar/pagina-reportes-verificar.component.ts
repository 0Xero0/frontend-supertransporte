import { Component, OnInit } from '@angular/core';
import { ServicioVerificaciones } from '../../servicios/verificaciones.service';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ResumenReporteAsignado } from '../../modelos/ResumenReporteAsignado';
import { FiltrosUsuarios } from 'src/app/usuarios/modelos/FiltrosUsuarios';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { FiltrosReportes } from 'src/app/encuestas/modelos/FiltrosReportes';

@Component({
  selector: 'app-pagina-reportes-verificar',
  templateUrl: './pagina-reportes-verificar.component.html',
  styleUrls: ['./pagina-reportes-verificar.component.css']
})
export class PaginaReportesVerificarComponent implements OnInit{
  paginador: Paginador<FiltrosUsuarios>
  reportes: ResumenReporteAsignado[] = []

  termino: any = ""
  rol: Rol | null

  constructor(
    private servicioVerifiaciones: ServicioVerificaciones,
    private servicioLocalStorage: ServicioLocalStorage,
  ){
    this.paginador = new Paginador<FiltrosReportes>(this.obtenerReportes)
    this.rol = this.servicioLocalStorage.obtenerRol()
  }

  ngOnInit(): void {
    this.paginador.inicializar()
  }

  obtenerReportes = (pagina: number, limite: number, filtros?: FiltrosReportes) =>{
    return new Observable<Paginacion>((subscripcion) => {
      this.servicioVerifiaciones.obtenerReportes(pagina, limite, filtros).subscribe({
        next: (respuesta) =>{
          this.reportes = respuesta.asignadas
          subscripcion.next(respuesta.paginacion)
        }
      })
    })
  }

  actualizarFiltros(){
    this.paginador.filtrar({ termino: this.termino })
  }
  limpiarFiltros(){
    this.paginador.inicializar()
  }
}
