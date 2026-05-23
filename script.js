document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Menu Mobile e Scroll Suave ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        burger.classList.toggle('toggle');
    });

    // Scroll Suave para todos os links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Fecha o menu mobile se estiver aberto
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            }
        });
    });


    // --- 2. Guia Prático (Abas) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const filterResult = document.getElementById('filter-result');

    const disposalSteps = {
        smartphone: `
            <h4>Smartphones e Tablets</h4>
            <ul>
                <li><strong>Backup:</strong> Salve seus arquivos na nuvem.</li>
                <li><strong>Limpeza:</strong> Restaure os padrões de fábrica.</li>
                <li><strong>Chips:</strong> Remova SIM cards e SD cards.</li>
                <li><strong>Descarte:</strong> Leve a coletores de eletrônicos.</li>
            </ul>
        `,
        notebook: `
            <h4>Notebooks e PCs</h4>
            <ul>
                <li><strong>HD/SSD:</strong> Apague seus dados ou remova o disco.</li>
                <li><strong>Periféricos:</strong> Separe mouses e teclados.</li>
                <li><strong>Bateria:</strong> Verifique se há danos externos.</li>
                <li><strong>Doação:</strong> Considere doar se estiver funcional.</li>
            </ul>
        `,
        pilhas: `
            <h4>Pilhas e Baterias</h4>
            <ul>
                <li><strong>Armazenamento:</strong> Use um pote seco e resistente.</li>
                <li><strong>Terminais:</strong> Isole os polos com fita crepe.</li>
                <li><strong>Atenção:</strong> Nunca jogue no lixo comum.</li>
                <li><strong>Pontos:</strong> Farmácias e mercados possuem coletores.</li>
            </ul>
        `,
        eletro: `
            <h4>Eletrodomésticos</h4>
            <ul>
                <li><strong>Preparação:</strong> Limpe resíduos internos.</li>
                <li><strong>Cabos:</strong> Mantenha os fios organizados.</li>
                <li><strong>Volume:</strong> Verifique o serviço de cata-treco local.</li>
                <li><strong>Marca:</strong> Consulte o programa de reciclagem da marca.</li>
            </ul>
        `
    };

    function switchTab(device) {
        tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.device === device));
        filterResult.style.opacity = 0;
        setTimeout(() => {
            filterResult.innerHTML = disposalSteps[device];
            filterResult.style.opacity = 1;
        }, 150);
    }

    tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.device)));
    switchTab('smartphone');


    // --- 3. Intersection Observer (Animações) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));


    // --- 4. Contador Animado (Stats) ---
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.getElementById('stats');
    let counted = false;

    const countUp = () => {
        stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();
            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = progress * (2 - progress);
                const currentNum = easedProgress * target;
                stat.innerText = currentNum.toFixed(target % 1 === 0 ? 0 : 1);
                if (progress < 1) requestAnimationFrame(updateCount);
                else stat.innerText = target;
            };
            requestAnimationFrame(updateCount);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
            countUp();
            counted = true;
        }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);


    // --- 5. Formulário (Web3Forms) ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.innerHTML = "Enviando...";
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: json
                });
                if (response.status === 200) {
                    formStatus.style.color = "var(--primary-green)";
                    formStatus.innerHTML = "Feedback enviado com sucesso!";
                    form.reset();
                } else {
                    formStatus.style.color = "red";
                    formStatus.innerHTML = "Erro ao enviar.";
                }
            } catch (error) {
                formStatus.innerHTML = "Algo deu errado.";
            }
        });
    }


    // --- 7. Mapa de Coleta (Leaflet + Nominatim - Foco Ecopontos) ---
    let map;
    let markers = [];
    let userMarker;
    const mapLoader = document.getElementById('map-loader');
    const listaPontos = document.getElementById('lista-pontos');
    const addressInput = document.getElementById('address-input');

    function initMap() {
        if (map) return;
        map = L.map('map').setView([-15.7801, -47.9292], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }

    initMap();

    // Função robusta de Fetch para Nominatim (Evita CORS em alguns cenários e segue política de uso)
    async function fetchNominatim(url) {
        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'pt-BR,pt;q=0.9',
                // Identificando a requisição para evitar bloqueios automáticos de bots
                'Referer': window.location.href 
            }
        });
        if (!response.ok) throw new Error('Falha na rede');
        return await response.json();
    }

    async function findNearbyPoints(lat, lon) {
        if (!map) initMap();
        mapLoader.classList.remove('d-none');
        listaPontos.innerHTML = '<p class="text-center p-4">Buscando ecopontos...</p>';
        
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        if (userMarker) map.removeLayer(userMarker);

        try {
            map.setView([lat, lon], 13);
            userMarker = L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '<i class="fas fa-user-circle" style="color: #3498db; font-size: 24px;"></i>'
                })
            }).addTo(map).bindPopup("Você está aqui").openPopup();

            // Busca focada em "Ecoponto" ou "Reciclagem" próxima às coordenadas, limitando o raio de busca via visualização do mapa
            const query = `https://nominatim.openstreetmap.org/search?format=json&q=lixo+eletronico+reciclagem+ecoponto&lat=${lat}&lon=${lon}&limit=50&addressdetails=1&bounded=0`;
            const data = await fetchNominatim(query);

            if (!data || data.length === 0) {
                listaPontos.innerHTML = '<p class="text-center p-4">Nenhum ponto de coleta encontrado muito próximo. Tente buscar pelo nome da sua cidade ou bairro.</p>';
                return;
            }

            // Calcula distância e filtra os 5 mais próximos em um raio razoável (ex: 50km)
            const points = data.map(item => ({
                ...item,
                distance: calculateDistance(lat, lon, item.lat, item.lon)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

            listaPontos.innerHTML = '';
            points.forEach(point => {
                const marker = L.marker([point.lat, point.lon]).addTo(map);
                marker.bindPopup(`<b>${point.display_name.split(',')[0]}</b><br>Ecoponto`);
                markers.push(marker);

                const itemDiv = document.createElement('div');
                itemDiv.className = 'ponto-item';
                itemDiv.innerHTML = `
                    <div class="ponto-header">
                        <span class="category-tag tag-public">Público / Ecoponto</span>
                        <h4>${point.display_name.split(',')[0]}</h4>
                    </div>
                    <p>${point.display_name.split(',').slice(1, 4).join(', ')}</p>
                    <span class="distancia"><i class="fas fa-route"></i> ${point.distance.toFixed(1)} km</span>
                `;
                itemDiv.onclick = () => {
                    map.setView([point.lat, point.lon], 16);
                    marker.openPopup();
                };
                listaPontos.appendChild(itemDiv);
            });
        } catch (error) {
            console.error(error);
            listaPontos.innerHTML = '<p class="text-center p-4">Erro de conexão com o mapa. Verifique sua internet ou tente mais tarde.</p>';
        } finally {
            mapLoader.classList.add('d-none');
        }
    }

    document.getElementById('btn-location').addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert("Geolocalização não suportada.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => findNearbyPoints(pos.coords.latitude, pos.coords.longitude),
            () => alert("Erro ao acessar localização.")
        );
    });

    document.getElementById('btn-search').addEventListener('click', async () => {
        const query = addressInput.value;
        if (!query) return;
        mapLoader.classList.remove('d-none');
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await res.json();
            if (data.length > 0) findNearbyPoints(data[0].lat, data[0].lon);
            else alert("Endereço não encontrado.");
        } catch (e) {
            alert("Erro na busca de endereço.");
        } finally {
            mapLoader.classList.add('d-none');
        }
    });

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
});
