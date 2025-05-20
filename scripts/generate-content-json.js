// scripts/generate-content-json.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // For parsing Markdown front matter
const marked = require('marked'); // For converting Markdown body to HTML

const contentRootDir = 'content';
const outputDir = 'data'; // This folder will be created at the root for generated JSON

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// --- Function to process a collection ---
function processCollection(collectionName, itemMapper) {
    const collectionPath = path.join(contentRootDir, collectionName);
    if (!fs.existsSync(collectionPath)) {
        console.warn(`Warning: Content directory for ${collectionName} not found: ${collectionPath}`);
        return [];
    }

    const files = fs.readdirSync(collectionPath).filter(file => file.endsWith('.md'));
    const data = [];

    files.forEach(file => {
        const filePath = path.join(collectionPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content: markdownBody } = matter(fileContent);

        data.push(itemMapper(frontMatter, markdownBody, file));
    });
    return data;
}

// --- Process Projects ---
const projectsData = processCollection('projects', (frontMatter, markdownBody, file) => {
    // For project listings, we might only need a truncated 'about'
    const fullProjectData = {
        id: frontMatter.id || path.basename(file, '.md'), // Ensure ID is present
        title: frontMatter.title,
        type: frontMatter.type,
        role: frontMatter.role,
        thumbnail: frontMatter.thumbnail,
        // For listing, take first 200 chars of about, remove HTML
        about: marked.parse(frontMatter.about || '').replace(/<[^>]*>?/gm, '').substring(0, 200),
        techStack: frontMatter.techStack || [] // Only need basic tech stack for listing
    };
    return fullProjectData;
});
fs.writeFileSync(path.join(outputDir, 'projects.json'), JSON.stringify(projectsData, null, 2));
console.log(`Generated projects.json with ${projectsData.length} projects.`);

// --- Process Articles ---
const articlesData = processCollection('articles', (frontMatter, markdownBody, file) => {
    return {
        slug: frontMatter.slug || path.basename(file, '.md'),
        title: frontMatter.title,
        date: frontMatter.date,
        featured_image: frontMatter.featured_image,
        author: frontMatter.author,
        excerpt: frontMatter.excerpt || marked.parse(markdownBody || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
        tags: frontMatter.tags || []
        // Note: full 'body' is NOT included here for performance on listing page.
        // It will be fetched by articleDetail.html
    };
});
// Sort articles by date descending
articlesData.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(path.join(outputDir, 'articles.json'), JSON.stringify(articlesData, null, 2));
console.log(`Generated articles.json with ${articlesData.length} articles.`);

// --- Process Testimonials ---
const testimonialsData = processCollection('testimonials', (frontMatter, markdownBody) => {
    return {
        author: frontMatter.author,
        title: frontMatter.title,
        content: marked.parse(frontMatter.content || ''), // Convert testimonial content to HTML
        order: frontMatter.order || 999 // For sorting
    };
});
// Sort testimonials by 'order' field
testimonialsData.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
fs.writeFileSync(path.join(outputDir, 'testimonials.json'), JSON.stringify(testimonialsData, null, 2));
console.log(`Generated testimonials.json with ${testimonialsData.length} testimonials.`);

// --- Static content (site settings, intro, tech icons library) are fetched directly as .md files ---
// No need to generate JSON for them as they are single instances.