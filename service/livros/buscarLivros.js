

export async function buscarLivros({setLivros}){
    var resultado = await fetch("https://apps-api-livros.ucxocw.easypanel.host/livros", {
        method: "GET",
        headers: {"Content-Type": "application/json"},

    });
    resultado = await resultado.json();

    setLivros(resultado.livros);
}

