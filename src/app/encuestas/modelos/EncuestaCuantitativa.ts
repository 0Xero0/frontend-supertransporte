export interface EncuestaCuantitativa{
    formularios: Formulario[]
    idVigilado: string
    idReporte: string
    idEncuesta: number
    vigencia: string
}

export interface Formulario {
    nombre:       string;
    subIndicador: SubIndicador[];
    evidencias: Evidencia[];
}

export interface SubIndicador {
    nombreSubIndicador: string;
    codigo:             number;
    preguntas:          Pregunta[];
}

export interface Evidencia {
    idEvidencia: number
    nombre: string
    tipoEvidencia: string // puede ser "FILE"
    validaciones: Validacion
    respuesta: string
    documento: string
    nombreOriginal: string
    ruta: string
    tamanio: number
}

export interface Validacion {
    tipoDato: string
    cantDecimal: number
    extension: string
}

export interface Pregunta {
    idPregunta:             number;
    pregunta:               string;
    obligatoria:            boolean;
    respuesta:              string;
    tipoDeEvidencia:        string;
    documento:              string;
    nombreOriginal:         string;
    ruta:                   string;
    adjuntable:             boolean;
    adjuntableObligatorio:  boolean;
    tipoPregunta:           string;
    valoresPregunta:        any[];
    validaciones:           any[] | null;
    observacion:            string;
    cumple:                 string;
    observacionCumple:      string;
    corresponde:            string;
    observacionCorresponde: string;
}
