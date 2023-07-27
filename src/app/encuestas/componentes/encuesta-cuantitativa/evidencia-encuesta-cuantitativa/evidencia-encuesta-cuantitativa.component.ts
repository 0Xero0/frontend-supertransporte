import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Evidencia } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { RespuestaEvidencia } from 'src/app/encuestas/modelos/RespuestaEvidencia';
import { ServicioArchivosEncuestas } from 'src/app/encuestas/servicios/archivos-encuestas.service';

@Component({
  selector: 'app-evidencia-encuesta-cuantitativa',
  templateUrl: './evidencia-encuesta-cuantitativa.component.html',
  styleUrls: ['./evidencia-encuesta-cuantitativa.component.css']
})
export class EvidenciaEncuestaCuantitativaComponent implements OnInit{
  @Input('evidencia') evidencia!: Evidencia
  @Input('idVigilado') idVigilado!: string
  @Output('nuevaEvidencia') nuevaEvidencia: EventEmitter<RespuestaEvidencia>
  @Output('evidenciaExcedeTamano') evidenciaExcedeTamano: EventEmitter<number>
  respuesta?: RespuestaEvidencia
  archivo: File | null = null
  valor: string = ""

  constructor(private servicioArchivos: ServicioArchivosEncuestas){
    this.nuevaEvidencia = new EventEmitter<RespuestaEvidencia>()
    this.evidenciaExcedeTamano = new EventEmitter<number>()
  }

  ngOnInit(): void {
    this.inicializarRespuestaEvidencia(this.evidencia)
  }

  manejarCambioEvidenciaArchivo(file: File | null){
    if(file){
      this.servicioArchivos.guardarArchivoTemporal(file, this.idVigilado, this.evidencia.idEvidencia, true)
      .subscribe({
        next: (infoArchivo)=>{
          this.respuesta!.ruta = infoArchivo.ruta 
          this.respuesta!.documento = infoArchivo.nombreAlmacenado
          this.respuesta!.nombreArchivo = infoArchivo.nombreOriginalArchivo
          this.nuevaEvidencia.emit(this.respuesta!)
        }
      })
    }
  }

  manejarExcedeTamano(){
    this.evidenciaExcedeTamano.emit(this.evidencia.tamanio)
  }

  manejarCambioEvidenciaNumerica(valor: string){
    console.log('valor', valor)
    this.respuesta!.valor = valor
    this.nuevaEvidencia.emit(this.respuesta)
  }

  inicializarRespuestaEvidencia(evidencia: Evidencia): void{
    this.respuesta = {
      evidenciaId: evidencia.idEvidencia,
      documento: evidencia.documento,
      nombreArchivo: evidencia.nombre,
      ruta: evidencia.ruta,
      valor: evidencia.respuesta
    }
  }

  descargarEvidencia(){
    this.servicioArchivos.descargarArchivo(this.evidencia.documento, this.evidencia.ruta, this.evidencia.nombreOriginal)
  }

}
