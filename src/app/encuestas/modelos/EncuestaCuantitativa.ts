export interface EncuestaCuantitativa{
    formularios: Formulario[]
    soloLectura: boolean
    soloLecturaV: boolean
    mensaje: string
    idVigilado: string
    idReporte: string
    idEncuesta: number
    vigencia: number
    totalConductores: number
    totalVehiculos: number
    variablesEntregadas: number
    evidenciasEntregadas: number
    clasificaion: string
    estadoActual: string
    razonSocila: string
    modalidad: string
    enviadosSt: EnviadoSt[]
}

export interface EnviadoSt{
    mes: string
    envioSt: string
}

export interface Formulario {
    nombre:       string;
    subIndicador: SubIndicador[];
    evidencias: Evidencia[];
    mensaje: string
}

export interface SubIndicador {
    nombreSubIndicador: string;
    codigo:             number;
    preguntas:          Pregunta[];
}

export interface Evidencia {
    consecutivo: number
    idEvidencia: number
    nombre: string
    tipoEvidencia: string // puede ser "FILE"
    validaciones: Validacion
    respuesta: string
    documento: string
    nombreOriginal: string
    ruta: string
    tamanio: number
    cumple: string
    corresponde: string
    observacionCorresponde: string
    observacionCumple: string
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
    respuesta:              number;
    tipoDeEvidencia:        string;
    documento:              string;
    nombreOriginal:         string;
    ruta:                   string;
    adjuntable:             boolean;
    adjuntableObligatorio:  boolean;
    tipoPregunta:           string;
    valoresPregunta:        any[];
    validaciones:           Validacion;
    observacion:            string;
    cumple:                 string;
    observacionCumple:      string;
    corresponde:            string;
    observacionCorresponde: string;
}
