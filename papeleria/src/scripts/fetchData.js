const fetchData =  () => {
    fetch('http://localhost:8000/api/products')
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar productos');
        return response.json();
    })
    .then(data => {
        console.log(data); 
    })
    .catch(error => {
        console.error(error);
    });
}

fetchData();
