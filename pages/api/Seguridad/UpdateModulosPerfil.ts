// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "PUT") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const { Values, ListaModulosSelected } = req.body;

    console.log("req.body", req.body);

    const NombreCapitalize =
      Values?.Nombre?.charAt(0)?.toUpperCase() + Values?.Nombre?.slice(1);

    const [UpdateROl]: any = await connectionPool.query(
      `UPDATE rol SET rol_nombre = '${NombreCapitalize}', roltip_id = ${Values?.Tipo} WHERE rol_id = ${Values?.Id}`
    );

    if (UpdateROl.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo editar" });
      return;
    }

    let BooleanInsert = false;

    let BooleaDelete = false;

    if (Object.keys(ListaModulosSelected)?.length) {
      let sqlBaseAcceso =
        "insert into ModulosPerfilAcceso (perfil_id,mod_id) values ";

      let DeleteBase = "DELETE FROM ModulosPerfilAcceso WHERE acc_id in (";

      for (const ListModulos in ListaModulosSelected) {
        let ModulosAborrar = [];

        const [ModulosAborrarSecon]: any = await connectionPool.query(`
        SELECT acc_id FROM ModulosPerfilAcceso INNER JOIN NewModulosSygescol ON (NewModulosSygescol.mod_id= ModulosPerfilAcceso.mod_id) WHERE NewModulosSygescol.submod_id=${ListModulos} and ModulosPerfilAcceso.perfil_id=${Values.Id} and NewModulosSygescol.submod_id != 0 and ModulosPerfilAcceso.perfil_id != 5 and ModulosPerfilAcceso.perfil_id != 1
        `);

        const [ModulosAborrarPrin]: any = await connectionPool.query(`
        SELECT acc_id FROM ModulosPerfilAcceso INNER JOIN NewModulosSygescol ON (NewModulosSygescol.mod_id= ModulosPerfilAcceso.mod_id) WHERE NewModulosSygescol.mod_id=${ListModulos} and ModulosPerfilAcceso.perfil_id=${Values.Id}  and ModulosPerfilAcceso.perfil_id != 5 and ModulosPerfilAcceso.perfil_id != 1
        `);

        ModulosAborrar = ModulosAborrarSecon.concat(ModulosAborrarPrin);

        if (ModulosAborrar?.length > 0) {
          BooleaDelete = true;
          for (const Modulos of ModulosAborrar) {
            DeleteBase += `${Modulos?.acc_id || ""},`;
          }

          DeleteBase = DeleteBase.slice(0, -1);
        }

        if (ListaModulosSelected[ListModulos]?.length > 0) {
          BooleanInsert = true;

          sqlBaseAcceso += `(${Values?.Id}, ${ListModulos}),`;

          for (const ListSubModulos of ListaModulosSelected[ListModulos]) {
            sqlBaseAcceso += ` (${Values?.Id}, ${ListSubModulos?.value}),`;
          }
        }
      }

      if (BooleaDelete) {
        DeleteBase += ")";

        console.log("DeleteBase", DeleteBase);

        const [DeleteModulos]: any = await connectionPool.query(DeleteBase);
      }

      if (BooleanInsert) {
        sqlBaseAcceso = sqlBaseAcceso.slice(0, -1);

        const [InsertModulos]: any = await connectionPool.query(sqlBaseAcceso);

        if (InsertModulos?.affectedRows === 0) {
          res.status(400).json({ body: "No se pudo editar" });
          return;
        }
      }
    }

    res.status(200).json({ body: "Se editó correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal Server Error" });
    return;
  }
}
