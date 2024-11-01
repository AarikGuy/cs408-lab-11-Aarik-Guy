// Load items when the page is loaded
window.onload = fetchItems;

// Fetch all items from the AWS Lambda API and display them in the table
async function fetchItems() {
    try {
        const response = await fetch('https://y2bjgl7qm9.execute-api.us-east-2.amazonaws.com/items');
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Display the items in the table
function displayItems(items) {
    const tableBody = document.getElementById('items-table-body');
    tableBody.innerHTML = ''; // Clear existing items

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><button onclick="deleteItem('${item.id}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Add a new item using the form data
document.getElementById('item-form').onsubmit = async function (event) {
    event.preventDefault(); // Prevent form submission

    const newItem = {
        id: document.getElementById('item-id').value,
        name: document.getElementById('item-name').value,
        price: document.getElementById('item-price').value,
    };

    try {
        const response = await fetch('https://y2bjgl7qm9.execute-api.us-east-2.amazonaws.com/items', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (response.ok) {
            fetchItems(); // Refresh the item list
            document.getElementById('item-form').reset(); // Clear the form
        } else {
            console.error('Error adding item:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }
};

// Delete an item by its ID
async function deleteItem(id) {
    try {
        const response = await fetch(`https://y2bjgl7qm9.execute-api.us-east-2.amazonaws.com/items/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchItems(); // Refresh the item list
        } else {
            console.error('Error deleting item:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

