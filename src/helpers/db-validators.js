const Usuario = require("../models/modelos/usuario");
const Empleado = require("../models/modelos/catalogos/empleado");
const Cliente = require("../models/modelos/catalogos/cliente");
const Dias = require("../models/modelos/catalogos/dias");
const EntradaSalida = require("../models/modelos/catalogos/entradaSalida");
const Eventos = require("../models/modelos/catalogos/eventos");
const DetalleRolSubModulo = require("../models/modelos/detalles/detalle_rol_sub_modulo");
const Permisos = require("../models/modelos/catalogos/permisos");
const DetallePermisosEmpleado = require("../models/modelos/detalles/detalle_permisos_empleado");
const PuestoTrabajo = require("../models/modelos/catalogos/puestoTrabajo");
const Vacaciones = require("../models/modelos/catalogos/vacaciones");
const Tolerancia = require("../models/modelos/catalogos/tolerancia");
const Ausencia = require("../models/modelos/catalogos/ausencias");
const EquipoTrabajo = require("../models/modelos/catalogos/equipoTrabajo");
const Actividades = require("../models/modelos/catalogos/actividades");
const Proyectos = require("../models/modelos/catalogos/proyectos");
const Etapa = require("../models/modelos/catalogos/etapa");
const Tarea = require("../models/modelos/detalles/detalle_actividad_tarea");
const Roles = require("../models/modelos/catalogos/roles");

const emailExiste = async (correo = "") => {
  //Verificar si el correo existe
  const usuario = await Usuario.findOne({
    where: {
      correo: correo,
    },
  });

  if (usuario) {
    throw new Error(`El correo ${correo} ya está registrado`);
  }
};

const emailExistente = async (correo = "") => {
  //Verificar si el correo existe
  const usuario = await Usuario.findOne({
    where: {
      correo: correo,
    },
  });

  if (!usuario) {
    throw new Error(`El correo ${correo} no se encuentra registrado`);
  }
};

const usuarioActivo = async (correo = "") => {
  //Verificar si el correo existe
  const usuario = await Usuario.findOne({
    where: {
      correo: correo,
    },
  });

  // VERIFICA SI EL USUARIO ESTÁ ACTIVO.
  if (usuario.estatus != 1) {
    //RETORNAMOS MENSAJE DE ERROR
    return res.status(400).json({
      ok: false,
      msg: "Usuario Inactivo",
    });
  }
};

const emailInexiste = async (correo = "", id_cat_usuario = 0) => {
  //Verificar si el correo existe
  const usuario = await Usuario.findOne({
    where: {
      correo: correo,
    },
  });
  console.log(usuario);
  if (usuario) {
    //Verificar si es un empleado o un cliente
    const empleado = await Empleado.findOne({
      where: {
        fk_cat_usuario: usuario.dataValues.id_cat_usuario,
      },
    });
    if (!empleado) {
      //Verificar si es un empleado o un cliente
      const cliente = await Cliente.findOne({
        where: {
          fk_cat_usuario: usuario.dataValues.id_cat_usuario,
        },
      });
      if (cliente.dataValues.id_cat_cliente != `${id_cat_usuario}`) {
        throw new Error(
          `El correo ${correo} ya está registrado con otro usuario`
        );
      }
    } else {
      if (empleado.dataValues.id_cat_empleado != `${id_cat_usuario}`) {
        throw new Error(
          `El correo ${correo} ya está registrado con otro usuario`
        );
      }
    }
  }
};

const existeEmpleadoPorId = async (id_cat_empleado) => {
  // Verificar si el candidato existe por su ID
  const empleado = await Empleado.findByPk(id_cat_empleado);
  if (!empleado) {
    throw new Error(`El empleado con ID ${id_cat_empleado} no existe`);
  }
};

const existeClientePorId = async (id_cat_cliente) => {
  // Verificar si la visita existe por su ID
  const cliente = await Cliente.findByPk(id_cat_cliente);
  if (!cliente) {
    throw new Error(`El cliente con ID ${id_cat_cliente} no existe`);
  }
};

const existeDiaPorId = async (id_cat_dias) => {
  // Verificar si la visita existe por su ID
  const dia = await Dias.findByPk(id_cat_dias);
  if (!dia) {
    throw new Error(`El dia con ID ${id_cat_dias} no existe`);
  }
};

const existeEntradaSalidaPorId = async (id_cat_entrada_salida) => {
  // Verificar si la visita existe por su ID
  const entradaSalida = await EntradaSalida.findByPk(id_cat_entrada_salida);
  if (!entradaSalida) {
    throw new Error(`La ES con ID ${id_cat_entrada_salida} no existe`);
  }
};

const existeEventoPorId = async (id_cat_eventos) => {
  // Verificar si la visita existe por su ID
  const evento = await Eventos.findByPk(id_cat_eventos);
  if (!evento) {
    throw new Error(`El evento con ID ${id_cat_eventos} no existe`);
  }
};

const existeDetalleRolSubModuloPorId = async (id_detalle_rol_sub_modulo) => {
  // Verificar si la visita existe por su ID
  const detalleRolSubModulo = await DetalleRolSubModulo.findByPk(
    id_detalle_rol_sub_modulo
  );
  if (!detalleRolSubModulo) {
    throw new Error(
      `El Detalle Rol-Sub modulo con ID ${id_detalle_rol_sub_modulo} no existe`
    );
  }
};

const existePermisoPorId = async (id_cat_permiso) => {
  // Verificar si la visita existe por su ID
  const permiso = await Permisos.findByPk(id_cat_permiso);
  if (!permiso) {
    throw new Error(`El Permiso con ID ${id_cat_permiso} no existe`);
  }
};

const existePermisoEmpleadoPorId = async (id_detalle_permisos_empleado) => {
  // Verificar si la visita existe por su ID
  const detallePermisosEmpleado = await DetallePermisosEmpleado.findByPk(
    id_detalle_permisos_empleado
  );
  if (!detallePermisosEmpleado) {
    throw new Error(
      `El Permiso Solicitado con ID ${id_detalle_permisos_empleado} no existe`
    );
  }
};

const existePuestoTrabajoPorId = async (id_cat_puesto_trabajo) => {
  // Verificar si la visita existe por su ID
  const puestoTrabajo = await PuestoTrabajo.findByPk(id_cat_puesto_trabajo);
  if (!puestoTrabajo) {
    throw new Error(
      `El Puesto de Trabajo con ID ${id_cat_puesto_trabajo} no existe`
    );
  }
  if (!puestoTrabajo.estatus) {
    throw new Error(
      `El Puesto de Trabajo con ID ${id_cat_puesto_trabajo} fue eliminado`
    );
  }
};

const existeVacacionPorId = async (id_cat_vacacion) => {
  // Verificar si la visita existe por su ID
  const vacacion = await Vacaciones.findByPk(id_cat_vacacion);
  if (!vacacion) {
    throw new Error(`La Vacacion con ID ${id_cat_vacacion} no existe`);
  }
  if (!vacacion.estatus) {
    throw new Error(`La Vacacion con ID ${id_cat_vacacion} fue eliminada`);
  }
};

const existeToleranciaPorId = async (id_cat_tolerancia) => {
  // Verificar si la visita existe por su ID
  const tolerancia = await Tolerancia.findByPk(id_cat_tolerancia);
  if (!tolerancia) {
    throw new Error(`La Tolerancia con ID ${id_cat_tolerancia} no existe`);
  }
  if (!tolerancia.estatus) {
    throw new Error(`La Tolerancia con ID ${id_cat_actividad} fue eliminada`);
  }
};

const existeAusenciaPorId = async (id_cat_ausencia) => {
  // Verificar si la visita existe por su ID
  const ausencia = await Ausencia.findByPk(id_cat_ausencia);
  if (!ausencia) {
    throw new Error(`La Ausencia con ID ${id_cat_ausencia} no existe`);
  }
};

const existeEquipoTrabajoPorId = async (id_cat_equipo_trabajo) => {
  // Verificar si la visita existe por su ID
  const equipo_trabajo = await EquipoTrabajo.findByPk(id_cat_equipo_trabajo);
  if (!equipo_trabajo) {
    throw new Error(
      `El Equipo de Trabajo con ID ${id_cat_equipo_trabajo} no existe`
    );
  }
  if (!equipo_trabajo.estatus) {
    throw new Error(
      `El Equipo de Trabajo con ID ${id_cat_actividad} fue eliminado`
    );
  }
};

const existeActividadPorId = async (id_cat_actividad) => {
  // Verificar si la visita existe por su ID
  const actividad = await Actividades.findByPk(id_cat_actividad);
  if (!actividad) {
    throw new Error(`La Actividad con ID ${id_cat_actividad} no existe`);
  }
};

const existeProyectoPorId = async (id_cat_proyecto) => {
  // Verificar si la visita existe por su ID
  const proyecto = await Proyectos.findByPk(id_cat_proyecto);
  if (!proyecto) {
    throw new Error(`El Proyecto con ID ${id_cat_proyecto} no existe`);
  }
  if (!proyecto.estatus) {
    throw new Error(`El Proyecto con ID ${id_cat_proyecto} fue eliminado`);
  }
};

const existeEtapaPorId = async (id_cat_etapa) => {
  // Verificar si la visita existe por su ID
  const etapa = await Etapa.findByPk(id_cat_etapa);
  if (!etapa) {
    throw new Error(`La Etapa con ID ${id_cat_etapa} no existe`);
  }
  if (!etapa.estatus) {
    throw new Error(`La Etapa con ID ${id_cat_etapa} fue eliminado`);
  }
};

const existeTareaPorId = async (id_detalle_actividad_tarea) => {
  // Verificar si la visita existe por su ID
  const tarea = await Tarea.findByPk(id_detalle_actividad_tarea);
  if (!tarea) {
    throw new Error(`La Tarea con ID ${id_detalle_actividad_tarea} no existe`);
  }
};

const existenEquiposTrabajoPorId = async (equipos_trabajo) => {
  let validador = true;
  let identificador = 0;
  for (let index = 0; index < equipos_trabajo.length; index++) {
    // Verificar si la visita existe por su ID
    const equipo_trabajo_encontrado = await EquipoTrabajo.findByPk(
      equipos_trabajo[index]
    );
    if (!equipo_trabajo_encontrado) {
      identificador = equipos_trabajo[index];
      validador = false;
    }
  }
  if (!validador) {
    throw new Error(`El equipo_trabajo con ID ${identificador} no existe`);
  }
};

const existenEtapasPorId = async (etapas) => {
  let validador = true;
  let identificador = 0;
  for (let index = 0; index < etapas.length; index++) {
    // Verificar si la visita existe por su ID
    const etapa_encontrada = await Etapa.findByPk(etapas[index]);
    if (!etapa_encontrada) {
      identificador = etapas[index];
      validador = false;
    }
  }
  if (!validador) {
    throw new Error(`La etapa con ID ${identificador} no existe`);
  }
};

const existenEmpleadosPorId = async (empleados) => {
  let validador = true;
  let identificador = 0;
  for (let index = 0; index < empleados.length; index++) {
    // Verificar si la visita existe por su ID
    const empleado_encontrado = await Empleado.findByPk(empleados[index]);
    if (!empleado_encontrado) {
      identificador = empleados[index];
      validador = false;
    }
  }
  if (!validador) {
    throw new Error(`El empleado con ID ${identificador} no existe`);
  }
};

const existenRolesPorId = async (roles) => {
  let validador = true;
  let identificador = 0;
  for (let index = 0; index < roles.length; index++) {
    // Verificar si la visita existe por su ID
    const rol_encontrado = await Roles.findByPk(roles[index]);
    if (!rol_encontrado) {
      identificador = roles[index];
      validador = false;
    }
  }
  if (!validador) {
    throw new Error(`El rol con ID ${identificador} no existe`);
  }
};

const existenActividadesPorId = async (actividades) => {
  let validador = true;
  let identificador = 0;
  for (let index = 0; index < actividades.length; index++) {
    // Verificar si la visita existe por su ID
    const actividad_encontrada = await Actividades.findByPk(actividades[index]);
    if (!actividad_encontrada) {
      identificador = actividades[index];
      validador = false;
    }
  }
  if (!validador) {
    throw new Error(`La actividad con ID ${identificador} no existe`);
  }
};

module.exports = {
  emailInexiste,
  emailExiste,
  emailExistente,
  existeEmpleadoPorId,
  existeClientePorId,
  usuarioActivo,
  existeDiaPorId,
  existeEntradaSalidaPorId,
  existeEventoPorId,
  existeDetalleRolSubModuloPorId,
  existePermisoPorId,
  existePermisoEmpleadoPorId,
  existePuestoTrabajoPorId,
  existeVacacionPorId,
  existeToleranciaPorId,
  existeAusenciaPorId,
  existeEquipoTrabajoPorId,
  existeActividadPorId,
  existeProyectoPorId,
  existeEtapaPorId,
  existeTareaPorId,
  existenEquiposTrabajoPorId,
  existenEtapasPorId,
  existenEmpleadosPorId,
  existenRolesPorId,
  existenActividadesPorId,
};
