// Nome do banco de dados JSON
const dbName = 'compras_loja';

// Carrega os dados do banco de dados JSON (localStorage) ao iniciar a p�gina
function loadFromDB() {
    const data = localStorage.getItem(dbName);
    if (data) {
        productList = JSON.parse(data);
    } else {
        productList = [];
    }
    updateTable();
}

// Salva os dados no banco de dados JSON (localStorage)
function saveToDB() {
    localStorage.setItem(dbName, JSON.stringify(productList));
}

// Atualiza o valor do pre�o total e do troco
function updateTable() {
    const tbody = document.querySelector('#productTable tbody');
    tbody.innerHTML = '';

    let totalPrice = 0;
    
    // Recalcula o ID para cada produto com base no �ndice da tabela
    productList.forEach((product, index) => {
        product.id = index + 1; // Recalcula o ID

        const subTotal = product.quantidade * product.preco;
        totalPrice += subTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td contenteditable="false">${product.codigo}</td>
            <td contenteditable="false">${product.nome}</td>
            <td contenteditable="false">${product.quantidade}</td>
            <td contenteditable="false">${product.preco}</td>
            <td>R$ ${subTotal.toFixed(2)}</td>
            <td>
                <button onclick="enableEdit(${index})">Editar</button>
                <button onclick="deleteProduct(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('totalPrice').innerText = `R$ ${totalPrice.toFixed(2)}`;
    calculateChange(totalPrice);  // Atualiza o troco com base no valor total
    saveToDB();  // Salva os dados sempre que a tabela for atualizada
}

// Fun��o para calcular o troco com base no valor pago
function calculateChange(totalPrice) {
    const valorPago = parseFloat(document.getElementById('valorPago').value);

    if (!isNaN(valorPago) && valorPago >= totalPrice) {
        const troco = valorPago - totalPrice;
        document.getElementById('troco').innerText = `R$ ${troco.toFixed(2)}`;
    } else {
        document.getElementById('troco').innerText = 'R$ 0.00';  // Se o valor pago for menor ou vazio
    }
}

// Fun��o que escuta as mudan�as no valor pago e recalcula o troco
document.getElementById('valorPago').addEventListener('input', () => {
    const totalPrice = parseFloat(document.getElementById('totalPrice').innerText.replace('R$', '').trim());
    calculateChange(totalPrice);
});


// Fun��o para adicionar produto
document.getElementById('addProduct').addEventListener('click', () => {
    const codigo = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const preco = parseFloat(document.getElementById('preco').value);

    if (codigo && nome && quantidade > 0 && preco > 0) {
        productList.push({
            id: 0,  // O ID ser� recalculado na fun��o updateTable()
            codigo: codigo,
            nome: nome,
            quantidade: quantidade,
            preco: preco
        });
        updateTable();
        clearForm();
    } else {
        alert('Preencha todos os campos corretamente.');
    }
});

// Fun��o para limpar o formul�rio
function clearForm() {
    document.getElementById('codigo').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('preco').value = '';
}

// Fun��o para tornar a linha edit�vel
function enableEdit(index) {
    const tr = document.querySelectorAll('#productTable tbody tr')[index];
    const tds = tr.querySelectorAll('td');

    // Torna as c�lulas de c�digo, nome, quantidade e pre�o edit�veis
    tds[1].setAttribute('contenteditable', 'true');
    tds[2].setAttribute('contenteditable', 'true');
    tds[3].setAttribute('contenteditable', 'true');
    tds[4].setAttribute('contenteditable', 'true');

    // Muda o bot�o de editar para salvar
    const editButton = tds[6].querySelector('button');
    editButton.textContent = 'Salvar';
    editButton.onclick = () => saveEdit(index, tds);
}

// Fun��o para salvar a edi��o
function saveEdit(index, tds) {
    const codigo = tds[1].innerText;
    const nome = tds[2].innerText;
    const quantidade = parseInt(tds[3].innerText);
    const preco = parseFloat(tds[4].innerText);

    if (codigo && nome && !isNaN(quantidade) && !isNaN(preco)) {
        productList[index].codigo = codigo;
        productList[index].nome = nome;
        productList[index].quantidade = quantidade;
        productList[index].preco = preco;
        updateTable();
    } else {
        alert('Preencha os campos corretamente.');
    }
}

// Fun��o para excluir produto
function deleteProduct(index) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        productList.splice(index, 1);
        updateTable();
    }
}

// Fun��o de busca de produtos
document.getElementById('search').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredProducts = productList.filter(product =>
        product.codigo.toLowerCase().includes(query) || product.nome.toLowerCase().includes(query)
    );

    const tbody = document.querySelector('#productTable tbody');
    tbody.innerHTML = '';

    filteredProducts.forEach((product, index) => {
        const subTotal = product.quantidade * product.preco;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td> <!-- Recalcula o ID -->
            <td>${product.codigo}</td>
            <td>${product.nome}</td>
            <td>${product.quantidade}</td>
            <td>${product.preco}</td>
            <td>R$ ${subTotal.toFixed(2)}</td>
            <td>
                <button onclick="enableEdit(${index})">Editar</button>
                <button onclick="deleteProduct(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
});

// Carrega os dados ao iniciar a p�gina
loadFromDB();
