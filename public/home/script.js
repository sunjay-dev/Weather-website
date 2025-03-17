function we(){
    let i1= document.getElementById('in1').value;

    fetch(`/api/weather?city=${i1}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); 
    })
    .then(data => {
        console.log(data);
        document.querySelector('p').innerHTML = JSON.stringify(data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}
