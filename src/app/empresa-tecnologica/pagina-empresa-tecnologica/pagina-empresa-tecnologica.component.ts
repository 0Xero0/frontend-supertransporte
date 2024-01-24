import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pagina-empresa-tecnologica',
  templateUrl: './pagina-empresa-tecnologica.component.html',
  styleUrls: ['./pagina-empresa-tecnologica.component.css']
})
export class PaginaEmpresaTecnologicaComponent {
  formulario: FormGroup

  constructor(){
    this.formulario = this.construirFormulario()
  }

  construirFormulario(){
    return new FormGroup({
      termino: new FormControl<string>(""),
      estado: new FormControl<number>(1)
    })
  }
}
