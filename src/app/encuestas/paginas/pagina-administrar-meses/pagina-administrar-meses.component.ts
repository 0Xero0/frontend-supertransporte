import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { MesVigencia } from '../../modelos/MesVigencia';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DateTime } from 'luxon';
import { Vigencia } from '../../modelos/Vigencia';

@Component({
  selector: 'app-pagina-administrar-meses',
  templateUrl: './pagina-administrar-meses.component.html',
  styleUrls: ['./pagina-administrar-meses.component.css']
})
export class PaginaAdministrarMesesComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  meses: MesVigencia[] = []
  vigencias?: Vigencia[] = []
  vigenciaActual: number

  constructor(private servicioEncuestas: ServicioEncuestas) {
    this.vigenciaActual = DateTime.now().year
  }

  ngOnInit(): void {
    this.obtenerMeses(this.vigenciaActual)
    this.obtenerVigencias()
  }

  cambiarVigencia(vigencia: number){
    this.vigenciaActual = vigencia
    this.obtenerMeses(this.vigenciaActual)
  }

  cambiarEstadoMes(idMes: number){
    this.servicioEncuestas.cambiarEstadoMesVigencia(idMes).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso("Actualizado con éxito")
        this.obtenerMeses(this.vigenciaActual)
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al actualizar", "Intentalo más tarde.")
      }
    })
  }

  obtenerMeses(vigencia: number){
    this.servicioEncuestas.obtenerMesesVigencia(vigencia).subscribe({
      next: (meses)=>{
        this.meses = meses
      }
    })
  }

  obtenerVigencias(){
    this.servicioEncuestas.obtenerVigencias().subscribe({
      next: (vigencias)=>{
        this.vigencias = vigencias
      }
    })
  }
}
