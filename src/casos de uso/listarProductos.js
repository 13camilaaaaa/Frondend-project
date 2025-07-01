export const listar_productos = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/productos");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(error);
    }
};