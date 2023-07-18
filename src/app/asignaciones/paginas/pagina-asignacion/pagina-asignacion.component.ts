import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ResumenReporte } from 'src/app/encuestas/modelos/ResumenReporte';
import { ServicioEncuestas } from 'src/app/encuestas/servicios/encuestas.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { ServicioReportes } from '../../servicios/reportes.service';
import { Verificador } from '../../modelos/Verificador';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Asignacion } from '../../modelos/Asignacion';
import { FiltrosReportesAsignados } from '../../modelos/FiltrosReportesAsignados';
import { ResumenReporteAsignado } from '../../modelos/ResumenReporteAsignado';
import { FiltrosReportesEnviados } from '../../modelos/FiltrosReportesEnviados';

@Component({
  selector: 'app-pagina-asignacion',
  templateUrl: './pagina-asignacion.component.html',
  styleUrls: ['./pagina-asignacion.component.css']
})
export class PaginaAsignacionComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5
  paginadorReportes: Paginador<FiltrosReportesEnviados>
  usuario: Usuario
  verificadores: Verificador[] = []
  verificadorSeleccionado?: string
  reportes: ResumenReporte[] = []
  reportesSeleccionados: ResumenReporte[] = []
  reportesAsignados: ResumenReporteAsignado[] = []
  paginadorReportesAsignados: Paginador<FiltrosReportesAsignados>

  termino: string = ""


  constructor(
    private servicioReportes: ServicioReportes,
    private servicioLocalStorage: ServicioLocalStorage
  ){
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if(!usuario){
      throw new ErrorAutorizacion()
    }
    this.paginadorReportesAsignados = new Paginador<FiltrosReportesAsignados>(this.obtenerReportesAsignados)
    this.usuario = usuario
    this.paginadorReportes = new Paginador<FiltrosReportesEnviados>(this.obtenerEncuestas)
  }

  ngOnInit(): void {
    this.obtenerVerificadores()
    this.paginadorReportes.inicializar(this.paginaInicial, this.limiteInicial, {})
  }

  obtenerEncuestas = (pagina: number, limite: number, filtros?:FiltrosReportesEnviados)=>{
    return new Observable<Paginacion>( sub => {
      this.servicioReportes.obtenerReportesEnviados(pagina, limite, filtros).subscribe({
        next: ( respuesta )=>{
          this.reportes = respuesta.reportadas
          sub.next(respuesta.paginacion)
        }
      })
    })
  }

  obtenerReportesAsignados = (pagina: number, limite: number, filtros?: FiltrosReportesAsignados)=>{
    return new Observable<Paginacion>( subscribcion =>{
      this.servicioReportes.obtenerReportesAsignados(pagina, limite, filtros).subscribe({
        next: ( respuesta )=>{
          this.reportesAsignados = respuesta.asignadas
          subscribcion.next(respuesta.paginacion)
          subscribcion.complete()
        }
      })
    })
    
  }

  obtenerVerificadores(){
    this.servicioReportes.obtenerVerificadores().subscribe({
      next: ( verificadores ) =>{
        this.verificadores = verificadores
      }
    })
  }

  seleccionarVerificador(identificacionVerificador: string){
    this.verificadorSeleccionado = identificacionVerificador
    this.paginadorReportesAsignados.inicializar()
    this.paginadorReportesAsignados.filtrar({identificacionVerificador: identificacionVerificador})
  }

  seleccionarReporte(reporte: ResumenReporte){
    this.reportesSeleccionados.push(reporte)
  }

  removerReporte(numeroReporte: number){
    this.reportesSeleccionados = this.reportesSeleccionados.filter( 
      (reporteSeleccionado) => numeroReporte !== reporteSeleccionado.numeroReporte 
    );
  }

  reporteSeleccionado(numeroReporte: number): boolean{
    const numeroReportesSeleccionados = this.reportesSeleccionados.map( reporte => reporte.numeroReporte )
    return numeroReportesSeleccionados.includes(numeroReporte) ? true : false;
  }

  eliminarAsignacion(numeroReporte: number){
    this.servicioReportes.eliminarAsignacion(numeroReporte).subscribe({
      next:  ()=>{
        this.popup.abrirPopupExitoso('Asignación removida.')
        this.paginadorReportesAsignados.inicializar()
        this.paginadorReportesAsignados.filtrar({identificacionVerificador: this.verificadorSeleccionado})
      },
      error: (error: HttpErrorResponse)=>{
        this.popup.abrirPopupFallido('Error al remover la asignación.', error.error.mensaje)
      }
    })
  }

  asignar(){
    if(!this.verificadorSeleccionado){
      this.popup.abrirPopupFallido('Error al asignar los reportes.', 'Debe seleccionar un verificador.')
      return;
    }
    const asignaciones: Asignacion[] = this.reportesSeleccionados.map( reporte => {
      return {
        reporte: reporte.numeroReporte,
        verificador: this.verificadorSeleccionado!
      }
    })
    this.servicioReportes.asignarReportes(asignaciones).subscribe({
      next: ()=>{
        this.paginadorReportes.refrescar()
        this.limpiarSeleccionados()
        this.paginadorReportesAsignados.inicializar()
        this.paginadorReportesAsignados.filtrar({identificacionVerificador: this.verificadorSeleccionado})
        this.popup.abrirPopupExitoso('Reportes asignados correctamente.')
      },
      error: (error: HttpErrorResponse)=>{
        this.popup.abrirPopupFallido('Error al asignar los reportes', error.error.mensaje)
      }
    })
  }

  actualizarFiltros(){
    this.paginadorReportes.filtrar({ termino: this.termino })
  }

  limpiarFiltros(){
    this.termino = ""
    this.paginadorReportes.filtrar({ termino: this.termino })
  }

  setTermino(termino: string){
    this.termino = termino
  }

  limpiarSeleccionados(){
    this.reportesSeleccionados = []
  }
}
