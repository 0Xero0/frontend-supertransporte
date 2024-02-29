export interface ResumenReporteAsignado {
    idReporte: number
    nit: string
    idEncuesta: number
    razonSocial: string
    asignador: string
    fechaAsignacion: string
    asignado: boolean
    estadoValidacion: string
    estadoAprobado: string
    observacion: string
}