import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Documento, SemestreAcademico, Programa } from "../../../../typings";

type Data = {
  docente?: Documento;
  DatosIncorrectos?: any;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { Estudiantes } = req.body;

    const { SubSede } = req.query;

    let DatosIncorrectos = [];

    let EstudiantesDuplicados = Estudiantes?.filter(
      (estudiante: any, index: any, self: any) =>
        index !==
        self.findIndex(
          (t: any) => t.NumeroDocumento === estudiante.NumeroDocumento
        )
    );

    if (EstudiantesDuplicados?.length > 0) {
      res.status(200).json({
        body: "Estudiantes Duplicados",
        DatosIncorrectos: EstudiantesDuplicados,
      });
      return;
    }

    const [CantAlumnos]: any = await connectionPool.query(`
    SELECT COUNT(pfc_alumno.alumno_id) as Cantidad FROM pfc_alumno
    `);

    const [TipoDocum]: any = await connectionPool.query(
      `SELECT id as Id, codigo as Codigo, nombre as Nombre FROM tipo_docum `
    );

    const [SemestreDb]: any = await connectionPool.query(
      `SELECT sem_id as Id, sem_nom as Nombre, sem_num as Numero FROM pfc_semestre`
    );

    const [Programas]: any = await connectionPool.query(`
    SELECT pro_id as Id,pro_nom as Nombre, pro_sigla as Sigla FROM pfc_programa where subSedeId='${SubSede}'
    `);

    console.log(
      `SELECT pfc_grupos.pfc_grupo_id as GrupoId,pfc_grupos.pfc_grupo_nom as GrupoNombre,pfc_programa.pro_nom as NombrePrograma, pfc_programa.pro_id ProgramaId,pfc_semestre.sem_id as SemestreId, pfc_semestre.sem_num as Sigla,SemestreLectivo.Id , SemestreLectivo.Nombre FROM pfc_grupos INNER JOIN pfc_grados ON (pfc_grados.pfc_grado_id=pfc_grupos.pfc_grado_id) INNER JOIN pfc_programa ON (pfc_programa.pro_id=pfc_grados.pro_id) INNER JOIN pfc_semestre ON (pfc_semestre.sem_id= pfc_grados.sem_id) INNER JOIN SemestreLectivo ON pfc_grados.pfc_grado_sem=SemestreLectivo.Id WHERE pfc_programa.subSedeId = '${SubSede}'`
    );

    const [GruposRes]: any = await connectionPool.query(
      `SELECT pfc_grupos.pfc_grupo_id as GrupoId,pfc_grupos.pfc_grupo_nom as GrupoNombre,pfc_programa.pro_nom as NombrePrograma, pfc_programa.pro_id ProgramaId,pfc_semestre.sem_id as SemestreId, pfc_semestre.sem_num as Sigla,SemestreLectivo.Periodicidad,SemestreLectivo.Nombre FROM pfc_grupos INNER JOIN pfc_grados ON (pfc_grados.pfc_grado_id=pfc_grupos.pfc_grado_id) INNER JOIN pfc_programa ON (pfc_programa.pro_id=pfc_grados.pro_id) INNER JOIN pfc_semestre ON (pfc_semestre.sem_id= pfc_grados.sem_id) INNER JOIN SemestreLectivo ON SemestreLectivo.Id=pfc_grados.pfc_grado_sem WHERE pfc_programa.subSedeId = '${SubSede}'`
    );

    let SqlAlumno =
      "INSERT INTO pfc_alumno (alumno_rum, tipo_docu_id, alumno_num_docu,alumno_ape1,alumno_ape2,alumno_nom1,alumno_nom2,alumno_celular,alumno_email) VALUES ";

    let SqlGrupo = "INSERT INTO pfc_matr_grup (matri_id, pfc_grupo_id) values";

    let SqlUsuario =
      "INSERT INTO usuario (login, pass, rol, tipo, idUsuario,subsede) values ";

    let RUM = CantAlumnos[0]?.Cantidad + 1;
    // año actual
    let anyo = new Date().getFullYear();

    let SqlMatricula =
      "INSERT INTO pfc_matricula (alumno_id,matri_anyo,programa,semestre,matri_estado,matri_nuevo,matri_fecha,semes_lectivo,subSedeId,GrupoMatriculadoId) VALUES";
    for (const Estudiante of Estudiantes) {
      const {
        Nombre,
        Apellidos,
        TipoDocumento,
        NumeroDocumento,
        Programa,
        Semestre,
        Grupo,
        Correo,
        WhatsApp,
        Periodicidad,
      } = Estudiante;

      let Document = TipoDocum.find((docun: Documento) =>
        docun?.Codigo?.toLowerCase().includes(TipoDocumento?.toLowerCase())
      );

      let SemestreAcademico = SemestreDb.find((sem: SemestreAcademico) =>
        sem?.Numero?.normalize("NFD")
          ?.replace(/[\u0300-\u036f]/g, "")
          ?.includes(
            Semestre?.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "")
          )
      );

      let ProgramaAcademico = Programas.find((programa: Programa) =>
        programa.Nombre?.toLowerCase()
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            Programa?.toLowerCase()
              ?.normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      );

      let GrupoId = GruposRes?.find((grupo: any) => {
        if (
          Semestre?.toLowerCase()?.includes(grupo?.Sigla?.toLowerCase()) &&
          grupo?.GrupoNombre?.slice(
            grupo?.GrupoNombre?.length - 2,
            grupo?.GrupoNombre?.length
          ).toLowerCase() &&
          grupo?.NombrePrograma?.toLowerCase()
            ?.normalize("NFD")
            ?.replace(/[\u0300-\u036f]/g, "")
            ?.includes(
              Programa?.toLowerCase()
                ?.normalize("NFD")
                ?.replace(/[\u0300-\u036f]/g, "")
            ) &&
          grupo?.Sigla?.normalize("NFD")
            ?.replace(/[\u0300-\u036f]/g, "")
            ?.includes(
              Semestre?.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "")
            ) &&
          grupo?.Nombre?.toLowerCase()
            ?.normalize("NFD")
            ?.replace(/[\u0300-\u036f]/g, "")
            ?.includes(
              Periodicidad?.toLowerCase()
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
        ) {
          return grupo;
        }
      });

      if (!GrupoId?.GrupoId) {
        DatosIncorrectos.push({
          ...Estudiante,
          Error: "No se encontro el grupo ",
        });
      }
      if (!ProgramaAcademico?.Id) {
        DatosIncorrectos.push({
          ...Estudiante,
          Error: "No se encontro el programa",
        });
      }
      if (!SemestreAcademico?.Id) {
        DatosIncorrectos.push({
          ...Estudiante,
          Error: "No se encontro el semestre",
        });
      }
      if (!Document?.Id) {
        DatosIncorrectos.push({
          ...Estudiante,
          Error: "No se encontro el tipo de documento",
        });
      }

      let Nombre1 = Nombre?.split(" ")[0];
      let Nombre2 = Nombre?.split(" ")[1];
      let Apellido1 = Apellidos?.split(" ")[0];
      let Apellido2 = Apellidos?.split(" ")[1];

      SqlAlumno += `(${RUM},${
        Document.Id
      },'${NumeroDocumento}','${Apellido1?.toUpperCase()}','${
        Apellido2?.toUpperCase() || ""
      }','${Nombre1?.toUpperCase()}','${
        Nombre2?.toUpperCase() || ""
      }','${WhatsApp}','${Correo}'),`;

      SqlMatricula += `('${RUM}','${anyo}','${ProgramaAcademico?.Id}','${
        SemestreAcademico?.Id || 0
      }',0,'A',curdate(),'A','${SubSede}','${GrupoId?.GrupoId}'),`;

      SqlUsuario += `('${NumeroDocumento}','${NumeroDocumento}','3','ESTUDIANTE','${RUM}','${SubSede}'),`;
      RUM++;
    }

    if (DatosIncorrectos?.length == 0) {
      SqlAlumno = SqlAlumno.slice(0, -1);
      SqlMatricula = SqlMatricula.slice(0, -1);

      SqlGrupo = SqlGrupo.slice(0, -1);
      SqlUsuario = SqlUsuario.slice(0, -1);

      const [SqlAlumnoAdd]: any = await connectionPool.query(SqlAlumno);
      // console.log(SqlAlumnoAdd);

      const [SqlMatriculaAdd]: any = await connectionPool.query(SqlMatricula);
      // console.log(SqlMatriculaAdd);

      const [SqlUsuarioAdd]: any = await connectionPool.query(SqlUsuario);
      console.log(SqlUsuarioAdd);

      res.status(200).json({ body: "Alumnos cargados correctamente" });
    } else {
      res.status(200).json({
        body: "Error Al hacer la carga masiva",
        DatosIncorrectos: DatosIncorrectos,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "15mb",
    },
  },
};

// limpiar espacios en blanco
