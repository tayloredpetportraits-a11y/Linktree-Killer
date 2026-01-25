// GROWTH ENGINE - Complete Integration Script
// Copy these functions into growth_os.html after the extractLinksFromData function

// 🎯 AD REMIX ENGINE - "Mad Libs" AI
function generateAdCampaigns(brandName, description) {
    // Extract keywords from description
    const words = description.split(' ').filter(w => w.length > 4).slice(0, 10);
    const keywords = words.join(' ').replace(/[^a-zA-Z\s]/g, '');

    return [
        {
            type: "Direct",
            headline: `Stop Settling for Average.`,
            body: `${brandName} - Experience the difference today.`,
            vibe: "🔥 Hype"
        },
        {
            type: "Mystery",
            headline: "The Secret Everyone's Talking About.",
            body: `Discover why ${brandName} is changing the game.`,
            vibe: "💎 Luxury"
        },
        {
            type: "Social",
            headline: `POV: You Found ${brandName}.`,
            body: "The viral sensation your feed has been missing.",
            vibe: "📱 TikTok"
        }
    ];
}

// 📞 CONTACT DNA EXTRACTION
function extractContactInfo(rawText) {
    const contact = {
        phone: null,
        email: null,
        address: null
    };

    // Phone regex (US format)
    const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const phoneMatch = rawText.match(phoneRegex);
    if (phoneMatch) contact.phone = phoneMatch[0];

    // Email regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = rawText.match(emailRegex);
    if (emailMatch) contact.email = emailMatch[0];

    // Simple address detection (contains "St", "Ave", "Rd", "Blvd" with numbers)
    const addressRegex = /\d+\s+[A-Za-z\s]+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way)/i;
    const addressMatch = rawText.match(addressRegex);
    if (addressMatch) contact.address = addressMatch[0];

    return contact;
}

// 🎨 3-TIER LINK RENDERER (Updated)
function renderLinkButtons(linksObj, primaryColor) {
    const linkGrid = document.getElementById('link-grid');
    linkGrid.innerHTML = '';

    const { money, standard, social } = linksObj;

    // 💰 TIER 1: MONEY BUTTONS (Glowing Lime - Top Priority)
    money.forEach((link) => {
        const btn = document.createElement('a');
        btn.href = link.url;
        btn.target = '_blank';
        btn.className = 'block w-full p-5 mb-4 text-center rounded-xl bg-[#d4e79e] text-black font-bold tracking-wide hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(212,231,158,0.3)] cursor-pointer';
        btn.textContent = link.label;
        linkGrid.appendChild(btn);
    });

    // 🎨 TIER 2: STANDARD BUTTONS (Glass - Middle)
    standard.forEach((link) => {
        const btn = document.createElement('a');
        btn.href = link.url;
        btn.target = '_blank';
        btn.className = 'block w-full p-4 mb-3 text-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/90 cursor-pointer group';

        btn.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-medium">${link.label}</span>
                <span class="text-white/30 group-hover:text-white/60 transition-all transform group-hover:translate-x-1">→</span>
            </div>
        `;
        linkGrid.appendChild(btn);
    });

    // 📱 TIER 3: SOCIAL DOCK (Icons - Bottom)
    if (social.length > 0) {
        const socialDock = document.createElement('div');
        socialDock.className = 'flex justify-center gap-6 mt-8 opacity-80';

        social.forEach((link) => {
            const icon = document.createElement('a');
            icon.href = link.url;
            icon.target = '_blank';
            icon.className = 'text-2xl hover:text-[#d4e79e] transition-colors cursor-pointer';

            // Map social platform to icon
            let emoji = '🔗';
            if (link.url.includes('instagram')) emoji = '📸';
            else if (link.url.includes('tiktok')) emoji = '🎵';
            else if (link.url.includes('facebook')) emoji = '👍';
            else if (link.url.includes('twitter')) emoji = '🐦';
            else if (link.url.includes('youtube')) emoji = '📺';

            icon.textContent = emoji;
            icon.title = link.label;
            socialDock.appendChild(icon);
        });

        linkGrid.appendChild(socialDock);
    }

    console.log(`🔗 Rendered: ${money.length} Money, ${standard.length} Standard, ${social.length} Social`);
}

// 📢 RENDER AD CAMPAIGNS
function renderAdCampaigns(campaigns) {
    const container = document.getElementById('ad-campaigns');
    if (!container) return;

    container.innerHTML = '';

    campaigns.forEach((ad, i) => {
        const card = document.createElement('div');
        card.className = 'border border-white/10 p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-all';
        card.innerHTML = `
            <div class="text-xs uppercase text-gray-500 mb-3">${ad.vibe}</div>
            <h4 class="font-serif text-xl text-white mb-2 italic">"${ad.headline}"</h4>
            <p class="text-gray-400 text-sm">${ad.body}</p>
        `;
        container.appendChild(card);
    });

    document.getElementById('campaigns-section').classList.remove('opacity-0');
}

// 📞 RENDER CONTACT INFO
function renderContactInfo(contact) {
    const container = document.getElementById('contact-dna');
    if (!container) return;

    container.innerHTML = '';

    if (contact.phone) {
        const phoneEl = document.createElement('a');
        phoneEl.href = `tel:${contact.phone}`;
        phoneEl.className = 'flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4e79e] transition-all cursor-pointer';
        phoneEl.innerHTML = `
            <span class="text-2xl">📞</span>
            <div>
                <div class="text-xs text-gray-500 uppercase">Call</div>
                <div class="text-white font-medium">${contact.phone}</div>
            </div>
        `;
        container.appendChild(phoneEl);
    }

    if (contact.email) {
        const emailEl = document.createElement('a');
        emailEl.href = `mailto:${contact.email}`;
        emailEl.className = 'flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4e79e] transition-all cursor-pointer';
        emailEl.innerHTML = `
            <span class="text-2xl">📧</span>
            <div>
                <div class="text-xs text-gray-500 uppercase">Email</div>
                <div class="text-white font-medium">${contact.email}</div>
            </div>
        `;
        container.appendChild(emailEl);
    }

    if (contact.address) {
        const addressEl = document.createElement('div');
        addressEl.className = 'flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10';
        addressEl.innerHTML = `
            <span class="text-2xl">📍</span>
            <div>
                <div class="text-xs text-gray-500 uppercase">Location</div>
                <div class="text-white font-medium">${contact.address}</div>
            </div>
        `;
        container.appendChild(addressEl);
    }

    if (contact.phone || contact.email || contact.address) {
        document.getElementById('contact-section').classList.remove('opacity-0');
    }
}
