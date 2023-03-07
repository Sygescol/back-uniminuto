export type User = {
  usu_rol: number;
  rol_nombre: string;
  menu: any[];
  DemasInfo: any;
  IdSubSede: number;
};

export type InfoEmpresa = {
  Nombre?: string;
  Direccion?: string;
  Departamento?: any;
  Municipio?: int;
  Tel1?: string;
  Tel2?: string;
  Correo?: string;
  Img?: string;
  WebSite?: string;
  Icfes?: string;
  Dane?: int;
  Men?: string;
  Sem?: string;
  Rector?: string;
  DocumentoRector?: int;
  NombreSecretaria?: string;
  NombreCortoInstitucion?: string;
  Nit?: int;
  Sede?: int;
  municipioId?: int;
};

export type DepartamentoMunicipio = {
  id: int;
  nombre: string;
};

export type RequisitrosMatricula = {
  Id: int;
  Nombre: string;
  Tipo: string;
  Target: string;
};

export type Programa = {
  Id: int;
  Nombre: string;
  Sigla: string;
  cantidad: number;
  preguntas: any;
  IdSubSede: string;
  Periodicidad: string;
};

export type Administrativo = {
  Id: int;
  Nombre: string;
  Apellidos: string;
  TipoDocumento: string;
  Documento: int;
  Cargo: string;
  Correo: string;
  Perfil: string;
  Usuario: string;
  Pass: string;
  Imagen: string;
  Password: string;
  Genero: number | string;
  IndexDocumento: number;
  TipoUsuario: number;
  IndexRol: number;
  IdSubSede?: string;
  SubSede?: string;
};

export type Documento = {
  Id: int;
  Codigo: string;
  Nombre: string;
};

export type Jornada = {
  Id: int;
  Nombre: string;
  Sigla: string;
};

export type SemestreAcademico = { Id: number; Nombre: string; Numero: any };

export type Competencia = {
  Id: int;
  Nombre: string;
  Orden: int;
  Abreviatura: string;
  TipoCompetencia: string;
};

export type Docente = {
  Id: int;
  Nombre: string;
  Apellidos: string;
  TipoDocumento: string;
  Documento: int;
  Usuario: string;
  Password: string;
  Genero: string;
  DocumCodigo: string;
  Imagen: string;
  Correo: string;
  Pass: string;
  IdSubSede?: string;
};

export type Pruebas = {
  Id: int;
  Semestre: int;
  Inicio: string;
  Fin: string;
  InicioDocente: Date;
};

export type VisibilidadModal = {
  AddVisible?: boolean;
  EditVisible?: boolean;
  Actualizar?: boolean;
  ActualizarHorario?: boolean;
};

export type Estudiante = {
  Id?: int | null;
  Nombre?: string | "";
  Apellidos?: string | "";
  TipoDocumento?: string | "";
  Documento: int | null;
  Genero?: string | "";
  Celular?: string | "";
  Correo?: string | "";
  Semestre?: int | null;
  Programa?: int | null;
  Jornada: int | null;
  Estado?: string | "";
  Nuevo?: string | "";
  Fecha?: string | "";
  SemesLectivo?: string | "";
  Password?: string | "";
  SemestreYear?: string | "";
  Grupo?: string | "";
  Imagen?: string | "";
  GrupoDestino?: number;
  Pass?: string | "";
  Usuario?: string | "";
};

export type DatosColegio = {
  Nombre: string;
  Direccion: string;
  Telefono1: string;
  Telefono2: string;
};

export type SeccionGuardada = [
  {
    Id: int;
    DocumentoEstudiante: String;
    Guardado: int;
    Seccion: string;
  }
];

export type Parametros = {
  Valor: string;
};

export type Formulario = {
  Apellido1: String;
  Apellido2: String;
  Barrio: String;
  Nombre1: String;
  Nombre2: String;
  DocumentoEstudiante: String;
  Programa: String;
  Jornada: String;
  Semestre: String;
};

export type visibleFormulario = {
  DatosAcademicos?: boolean;
  InfoStudent?: boolean;
  NecesidadesEducativas?: boolean;
  Religion?: boolean;
  Localizacion?: boolean;
  VictimaConflicto?: boolean;
  SaludStudent?: boolean;
  TransporteEscolar?: boolean;
  Acudiente?: boolean;
  Madre?: boolean;
  Padre?: boolean;
  Pae?: boolean;
  LocalEstudiante?: boolean;
  ArchivosMatricula?: boolean;
  CuadroAcumulativo?: boolean;
};
export type ConfiguracionRegistro = {
  Id: int;
  Nombre: string;
  Apellidos: string;
  TipoDocumento: string;
  Documento: int;
  Genero: string;
  Celular: string;
  Correo: string;
  Semestre: int;
  Programa: int;
};

export type ModulosPerfiles = {
  Id?: int;
  Tipo: number | null;
  Nombre: string | "";
  Rol?: number | null;
  Modulos?: [];
};

export type Modulos = {
  Id?: int;
  NombreModulo: string | "";
  SubModulos?: [
    {
      Id?: int;
      SubModulo: string | "";
      Icono: string | "";
      Link: string | "";
    }
  ];
};

export type ModulosSelect = {
  Id?: int;
  NombreModulo: string | "";
  SubModulos?: any;
  SubModulosActivos?: [];
};

export type Grupo = {
  Id: int;
  Nombre: string;
};

export type ItemSubModulo = {
  Icon: string;
  Link: string;
  SubModulo: string;
  id: number;
  ModuloPrincipal?: number;
};
export type Nees = {
  neeFisica: [{ id_nee: number; id_tipo_nee: number; nombre_nee: string }];
  neeSensorial: [{ id_nee: number; id_tipo_nee: number; nombre_nee: string }];
  neePsiquica: [{ id_nee: number; id_tipo_nee: number; nombre_nee: string }];
  neeCognitiva: [{ id_nee: number; id_tipo_nee: number; nombre_nee: string }];
  neeTalentos: [{ id_nee: number; id_tipo_nee: number; nombre_nee: string }];
};
export type preguntaIngreso = {
  tipo: number;
  texto: string;
  respuestas: any;
  correcta: any;
  pregunta: string;
};

export type Rectoria = {
  Id: String;
  Nombre: String;
};

export type Sede = {
  Id?: number;
  NombreSede?: string;
  // Direccion?: string;
};
export type Revisiones = {
  Contador?: number;
};

export type Localidades = [
  {
    id: number;
    nombre: string;
    coas: [];
  }
];

export type SemestreLectivo = {
  Id: number;
  Nombre: string;
  Meses: string;
};

export type COA = {
  Id: number;
  Nombre: string;
};
