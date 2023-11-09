import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { Mes } from '../../modelos/Mes';
import { MesVigencia } from '../../modelos/MesVigencia';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';

@Component({
  selector: 'app-pagina-administrar-meses',
  templateUrl: './pagina-administrar-meses.component.html',
  styleUrls: ['./pagina-administrar-meses.component.css']
})
export class PaginaAdministrarMesesComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  meses: MesVigencia[] = []

  constructor(private servicioEncuestas: ServicioEncuestas) {}

  ngOnInit(): void {
    this.obtenerMeses()
  }

  cambiarEstadoMes(idMes: number){
    this.servicioEncuestas.cambiarEstadoMesVigencia(idMes).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso("Actualizado con éxito")
        this.obtenerMeses()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al actualizar", "Intentalo más tarde.")
      }
    })
  }

  obtenerMeses(){
    this.servicioEncuestas.obtenerMesesVigencia().subscribe({
      next: (meses)=>{
        this.meses = meses
      }
    })
  }
}
