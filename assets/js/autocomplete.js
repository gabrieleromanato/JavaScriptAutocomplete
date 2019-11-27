'use strict';


const request = (url, queryString) => {
    return new Promise((resolve, reject) => {

        fetch(url + '?' + queryString, {
            method: 'GET'
        }).then(response => {
            if(response.ok) {
                resolve(response.json());
            } else {
                reject({
                    error: 500
                });
            }
        });

    });
};

const prepareLayout = () => {
    const wrap = document.querySelectorAll('.autocomplete-wrap');
    Array.prototype.forEach.call(wrap, element => {
        let autocomplete = document.createElement('div');
        autocomplete.className = 'autocomplete';
        autocomplete.innerHTML = '<ul></ul>';

        element.appendChild(autocomplete);
    });
};

const getResults = async keyword => {
    try {
        const users = await request('http://localhost:3000/users/', 'last_name_like=' + encodeURIComponent(keyword));
        let html = '';
        if(users.length > 0) {
            users.forEach(user => {
                let str = `<li class="autocomplete-item">${user.first_name} ${user.last_name}</li>`;
                html += str;
            });
        }
        return html;
    } catch(err) {
        return err;
    }
};

const autocomplete =  input => {

    document.addEventListener('click', e => {
        const element = e.target;
        if(element.classList.contains('autocomplete-item')) {
            input.value = element.innerText;
        }
    }, false);

    input.addEventListener('keyup', async () => {
        let value = input.value;
        let autocomplete = document.querySelector('#autocomplete .autocomplete');
        autocomplete.style.display = 'none';
        if(value.length >= 3) {
            let wrap = autocomplete.querySelector('ul');

            try {
                const results = await getResults(value);
                wrap.innerHTML = results;
                autocomplete.style.display = 'block';
            } catch(err) {
                console.log(err);
            }
        }
    }, false);
};

document.addEventListener('DOMContentLoaded', () => {
    prepareLayout();
    autocomplete(document.querySelector('#term'));
});