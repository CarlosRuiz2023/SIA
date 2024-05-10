// FUNCION PARA GENERAR EL NÚMERO DE EMPLEADO.
const generarNumeroEmpleado = (
  nombre,
  apellido_Paterno,
  apellido_Materno,
  fecha_contratacion
) => {
  const primerLetra = nombre.charAt(0);
  const segundaLetra = apellido_Paterno.charAt(0);
  let terceraLetra = apellido_Materno;

  if (apellido_Materno === "") {
    terceraLetra = "X";
  } else {
    terceraLetra = terceraLetra.charAt(0);
  }

  const fechaOriginal = fecha_contratacion;
  const fechaConvertida = new Date(fechaOriginal)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  return (
    primerLetra.toUpperCase() +
    segundaLetra.toUpperCase() +
    terceraLetra.toUpperCase() +
    fechaConvertida
  );
};

module.exports = {
  generarNumeroEmpleado,
};
