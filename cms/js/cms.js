document.addEventListener('DOMContentLoaded', function() {
    let artworks = [];
    const artworkList = document.getElementById('artworkList');
    const searchInput = document.getElementById('searchInput');
    const artworkModal = document.getElementById('artworkModal');
    const artworkForm = document.getElementById('artworkForm');
    const newArtworkBtn = document.getElementById('newArtworkBtn');

    // Load artworks
    async function loadArtworks() {
        try {
            const response = await fetch('../data/artworks.json');
            const data = await response.json();
            artworks = data.artworks;
            renderArtworks();
        } catch (error) {
            console.error('Error loading artworks:', error);
        }
    }

    // Render artwork list
    function renderArtworks(filteredArtworks = null) {
        const displayArtworks = filteredArtworks || artworks;
        artworkList.innerHTML = displayArtworks.map(artwork => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="../images/${artwork.image}" alt="${artwork.title.en}" class="h-20 w-20 object-cover rounded">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${artwork.title.en}</div>
                    <div class="text-sm text-gray-500">${artwork.title.tw}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${artwork.year}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${artwork.dimensions}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="editArtwork('${artwork.id}')" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button onclick="deleteArtwork('${artwork.id}')" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (!searchTerm) {
            renderArtworks();
            return;
        }

        const filtered = artworks.filter(artwork => 
            artwork.title.en.toLowerCase().includes(searchTerm) ||
            artwork.title.tw.includes(searchTerm) ||
            artwork.year.includes(searchTerm) ||
            artwork.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        renderArtworks(filtered);
    });

    // Modal functions
    window.openModal = function(isNew = false) {
        artworkModal.classList.remove('hidden');
        document.getElementById('modalTitle').textContent = isNew ? 'New Artwork' : 'Edit Artwork';
        if (isNew) {
            artworkForm.reset();
            document.getElementById('artworkId').value = '';
        }
    }

    window.closeModal = function() {
        artworkModal.classList.add('hidden');
        artworkForm.reset();
    }

    window.editArtwork = function(id) {
        const artwork = artworks.find(a => a.id === id);
        if (!artwork) return;

        document.getElementById('artworkId').value = artwork.id;
        document.getElementById('titleEn').value = artwork.title.en;
        document.getElementById('titleTw').value = artwork.title.tw;
        document.getElementById('year').value = artwork.year;
        document.getElementById('dimensions').value = artwork.dimensions;
        document.getElementById('medium').value = artwork.medium;
        document.getElementById('descriptionEn').value = artwork.description.en;
        document.getElementById('descriptionTw').value = artwork.description.tw;
        document.getElementById('tags').value = artwork.tags.join(', ');

        openModal(false);
    }

    window.deleteArtwork = async function(id) {
        if (!confirm('Are you sure you want to delete this artwork?')) return;

        try {
            // In a real application, you would make an API call here
            artworks = artworks.filter(a => a.id !== id);
            await saveArtworks();
            renderArtworks();
        } catch (error) {
            console.error('Error deleting artwork:', error);
        }
    }

    // Form submission
    artworkForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            id: document.getElementById('artworkId').value || `artwork${Date.now()}`,
            title: {
                en: document.getElementById('titleEn').value,
                tw: document.getElementById('titleTw').value
            },
            year: document.getElementById('year').value,
            dimensions: document.getElementById('dimensions').value,
            medium: document.getElementById('medium').value,
            description: {
                en: document.getElementById('descriptionEn').value,
                tw: document.getElementById('descriptionTw').value
            },
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
            image: 'placeholder.jpg', // In a real application, handle image upload
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString().split('T')[0]
        };

        try {
            const existingIndex = artworks.findIndex(a => a.id === formData.id);
            if (existingIndex >= 0) {
                artworks[existingIndex] = { ...artworks[existingIndex], ...formData };
            } else {
                artworks.push(formData);
            }

            await saveArtworks();
            closeModal();
            renderArtworks();
        } catch (error) {
            console.error('Error saving artwork:', error);
        }
    });

    // Save artworks to file
    async function saveArtworks() {
        try {
            // In a real application, you would make an API call here
            const data = { artworks };
            console.log('Saving artworks:', data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Error saving artworks:', error);
            throw error;
        }
    }

    // New artwork button
    newArtworkBtn.addEventListener('click', () => openModal(true));

    // Initial load
    loadArtworks();
}); 