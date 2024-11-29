import { Component, OnInit } from '@angular/core';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { ServicioVerificaciones } from 'src/app/verificaciones/servicios/verificaciones.service';
import { Observable } from 'rxjs';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ResumenReporteAsignado } from 'src/app/verificaciones/modelos/ResumenReporteAsignado';
import { FiltrosUsuarios } from 'src/app/usuarios/modelos/FiltrosUsuarios';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { FiltrosReportes } from 'src/app/encuestas/modelos/FiltrosReportes';

@Component({
  selector: 'app-pagina-resultados-indicadores',
  templateUrl: './pagina-resultados-indicadores.component.html',
  styleUrls: ['./pagina-resultados-indicadores.component.css']
})
export class PaginaResultadosIndicadoresComponent implements OnInit{
  paginador: Paginador<any>
  reportes: ResumenReporteAsignado[] = []

  termino: any = ""
  rol: Rol | null

  constructor(
    private servicioVerificaciones: ServicioVerificaciones,
    private servicioLocalStorage: ServicioLocalStorage,
  ){
    this.paginador = new Paginador<{ idVerificador: string, termino?:string }>(this.obtenerReportes);
    this.rol = this.servicioLocalStorage.obtenerRol()
  }

  ngOnInit(): void {
    this.paginador.inicializar()
    
  }

  obtenerReportes = (pagina: number, limite: number,filtros?: { idVerificador: string, termino?:string }) =>{
    return new Observable<Paginacion>((subscripcion) => {
      this.servicioVerificaciones.obtenerReportesFaseDos(pagina, limite, filtros).subscribe({
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


