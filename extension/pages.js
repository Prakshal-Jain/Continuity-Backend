const content_container = document.body;


export const render_loading_page = () => {
    content_container.innerHTML = '';
    const logo = document.createElement('div');
    logo.classList.add('logo');
    content_container.appendChild(logo);

    const loading_icon = document.createElement('i');
    loading_icon.classList.add('fa', 'fa-spinner', 'fa-spin');
    loading_icon.style.fontSize = 'x-large';
    loading_icon.style.marginTop = '1em';
    loading_icon.style.color = 'rgba(99, 99, 102, 1)';
    content_container.appendChild(loading_icon);

    const loading_text = document.createElement('div');
    loading_text.classList.add('loading_text');
    loading_text.appendChild(document.createTextNode('Hang tight, getting ready for an epic experience!'));
    content_container.appendChild(loading_text);

}




const device_type_checklist = [
    { id: 'mobile-phone', label: 'Mobile Phone' },
    { id: 'tablet', label: 'Tablet' },
    { id: 'laptop', label: 'Laptop' },
    { id: 'desktop', label: 'Desktop', isSelected: true },
];

export const render_login_page = () => {
    content_container.innerHTML = '';
    const logo = document.createElement('div');
    logo.classList.add('logo');
    content_container.appendChild(logo);

    const input = document.createElement('input');
    input.placeholder = 'Device Name';
    input.classList.add('device_name');
    input.setAttribute('required', true);
    content_container.appendChild(input);

    const device_type_heading = document.createElement('h2');
    device_type_heading.classList.add('device_type_heading');
    const heading_txt = document.createTextNode("Device Type");
    device_type_heading.appendChild(heading_txt);
    content_container.appendChild(device_type_heading);

    const radio_list = document.createElement('div');
    radio_list.classList.add('radio_list');
    device_type_checklist.forEach(({ id, label, isSelected = false }) => {
        const radio_container = document.createElement('div');
        radio_container.classList.add('radio_container');
        const lab = document.createElement('label');
        lab.setAttribute('for', id);
        lab.appendChild(document.createTextNode(label))
        lab.classList.add('device_type_radio');

        const radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('id', id);
        radio.setAttribute('name', "device_type");
        if (isSelected === true) {
            radio.setAttribute('checked', isSelected);
        }
        radio_container.appendChild(radio);
        radio_container.appendChild(lab);
        radio_list.appendChild(radio_container);
    })
    content_container.appendChild(radio_list);

    const get_started = document.createElement('button');
    get_started.appendChild(document.createTextNode('Get Started'));
    get_started.classList.add('get_started');
    content_container.appendChild(get_started);
}