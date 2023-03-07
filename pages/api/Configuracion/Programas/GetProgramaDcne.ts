import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Programa } from "../../../../typings";

type Data = {
  programas: Programa[];
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const { SubSede, IdRol, IdUser } = req.query;

    // console.log(
    //   `select rol.rol_nombre as NombreRol, rol_tipo.roltip_id as RolTipo, rol_tipo.roltip_id as RolTipoId from rol LEFT join rol_tipo on (rol.roltip_id=rol_tipo.roltip_id) where rol.rol_id=${IdRol}`
    // );

    const [RolTipo]: any = await connectionPool.query(
      `select rol.rol_nombre as NombreRol, rol_tipo.roltip_id as RolTipo, rol_tipo.roltip_id as RolTipoId from rol LEFT join rol_tipo on (rol.roltip_id=rol_tipo.roltip_id) where rol.rol_id=${IdRol}`
    );

    // profesor
    if (RolTipo[0]?.RolTipoId == "2") {
      const [pruebas]: any = await connectionPool.query(
        `SELECT * FROM asignacionPrueba inner join pfc_ejes on (pfc_ejes.pfc_ejes) WHERE docente=${IdUser}`
      );

      console.log(pruebas);
    }

    // const [ProgramasRes]: any = await connectionPool.query(
    //   `SELECT pfc_programa.pro_id as Id,pfc_programa.pro_nom as Nombre,pfc_programa.pro_sigla as Sigla, subSedes.nombre as SubSede,pfc_programa.periodicidad as Periodicidad FROM pfc_programa INNER JOIN subSedes on subSedes.id=pfc_programa.subSedeId ${
    //     SubSede && SubSede != "0" ? `where subSedeId = '${SubSede}'` : ""
    //   }`
    // );
    // console.log("🚀 ~ file: GetProgramas.ts:30 ~ ProgramasRes", ProgramasRes);

    // res.status(200).json({ programas: ProgramasRes } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
