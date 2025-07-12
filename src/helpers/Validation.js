
export const Validation = {
    // valida que no esté vacío
    isNotEmpty: (value) => {
        return value.trim() !== "";
    },

    // valida que no contenga números
    isTextOnly: (value) => {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value.trim());
    },

    // valida que solo contenga números
    isNumberOnly: (value) => {
        return /^[0-9]+$/.test(value.trim());
    },

    // valida el formato de correo electrónico
    isValidEmail: (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    },

    // valida contraseñas seguras (mínimo 6 caracteres, al menos una mayúscula y un número)
    isValidPassword: (value) => {
        return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
    },

    // valida longitud máxima
    hasMaxLength: (value, max) => {
        return value.trim().length <= max;
    },

    // valida longitud mínima (ej: para nombres)
    hasMinLength: (value, min) => {
        return value.trim().length >= min;
    },

    // valida que sea una fecha válida (opcional)
    isValidDate: (value) => {
        return !isNaN(Date.parse(value));
    },

    // valida que sea una cédula válida (solo números y entre 6 a 10 dígitos)
    isValidCedula: (value) => {
        const clean = value.trim();
        return /^[0-9]{6,10}$/.test(clean);
    },
    
    // valida que un select tenga una opción seleccionada (no vacía)
    isSelectValid: (value) => {
        return value !== "" && value !== null && value !== undefined;
    },
};