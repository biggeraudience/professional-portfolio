// js/contentLoader.js

// Function to fetch and parse Markdown files with YAML front matter
async function fetchMarkdownContent(path) {
    const response = await fetch(path);
    if (!response.ok) {
        console.error(`Failed to fetch content from ${path}: ${response.statusText}`);
        return null;
    }
    const text = await response.text();

    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = text.match(frontMatterRegex);

    let data = {};
    let body = text;

    if (match) {
        const yamlPart = match[1];
        body = match[2];

        try {
            // jsyaml.load comes from the js-yaml-browser CDN script
            data = jsyaml.load(yamlPart);
        } catch (e) {
            console.error("Error parsing YAML front matter:", e);
            // Continue with an empty data object if parsing fails
        }
    }
    return { data, body };
}

// Function to convert Markdown to HTML using marked.js
function markdownToHtml(markdown) {
    if (!markdown) return '';
    // marked.parse comes from the marked.js CDN script
    return marked.parse(markdown);
}

// --- General Content Loaders ---

async function loadAllProjects() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            console.error('Failed to load data/projects.json:', response.statusText);
            return [];
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching projects.json:', error);
        return [];
    }
}

async function loadProject(projectId) {
    const content = await fetchMarkdownContent(`content/projects/${projectId}.md`);
    if (content && content.data) {
        return {
            id: projectId,
            title: content.data.title,
            type: content.data.type,
            role: content.data.role,
            thumbnail: content.data.thumbnail,
            problem: markdownToHtml(content.data.problem),
            goal: markdownToHtml(content.data.goal),
            designProcess: markdownToHtml(content.data.designProcess),
            about: markdownToHtml(content.data.about),
            challenges: markdownToHtml(content.data.challenges),
            solutions: markdownToHtml(content.data.solutions),
            lessons: markdownToHtml(content.data.lessons),
            visuals: content.data.visuals || [],
            techStack: content.data.techStack || [],
        };
    }
    return null;
}

async function loadAllArticles() {
    try {
        const response = await fetch('data/articles.json');
        if (!response.ok) {
            console.error('Failed to load data/articles.json:', response.statusText);
            return [];
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching articles.json:', error);
        return [];
    }
}

async function loadArticle(slug) {
    const content = await fetchMarkdownContent(`content/articles/${slug}.md`);
    if (content) {
        return { ...content.data, body: markdownToHtml(content.body) };
    }
    return null;
}

async function loadAllTestimonials() {
    try {
        const response = await fetch('data/testimonials.json');
        if (!response.ok) {
            console.error('Failed to load data/testimonials.json:', response.statusText);
            return [];
        }
        const testimonials = await response.json();
        // Sort by 'order' field if present, otherwise no specific order
        return testimonials.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
    } catch (error) {
        console.error('Error fetching testimonials.json:', error);
        return [];
    }
}

async function loadSiteSettings() {
    const content = await fetchMarkdownContent('content/settings/main.md');
    if (content && content.data) {
        return {
            siteTitle: content.data.site_title,
            resumeFile: content.data.resume_file,
            profilePhotoHeader: content.data.profile_photo_header,
            footerText: content.data.footer_text,
            socialLinks: content.data.social_links || []
        };
    }
    return {};
}

async function loadIntroContent() {
    const content = await fetchMarkdownContent('content/sections/intro.md');
    if (content && content.data) {
        return {
            headline: content.data.headline,
            subheadline: content.data.subheadline,
            introText: markdownToHtml(content.data.intro_text),
            introProfileImage: content.data.intro_profile_image
        };
    }
    return {};
}
async function loadSiteSettings() {
    const content = await fetchMarkdownContent('content/settings/main.md');
    if (content && content.data) {
        return {
            siteTitle: content.data.site_title,
            resumeFile: content.data.resume_file,
            profilePhotoHeader: content.data.profile_photo_header,
            footerText: content.data.footer_text,
            socialLinks: content.data.social_links || []
        };
    }
    return {};
}

async function loadIntroContent() {
    const content = await fetchMarkdownContent('content/sections/intro.md');
    if (content && content.data) {
        return {
            headline: content.data.headline,
            subheadline: content.data.subheadline,
            introText: markdownToHtml(content.data.intro_text),
            introProfileImage: content.data.intro_profile_image
        };
    }
    return {};
}

// NEW: Load About Me Page Content
async function loadAboutContent() {
    const content = await fetchMarkdownContent('content/pages/about.md');
    if (content && content.data) {
        return {
            introduction: content.data.introduction,
            skills: content.data.skills,
            experience: content.data.experience,
            philosophy: content.data.philosophy,
            beyond_work: content.data.beyond_work,
            cta_text: content.data.cta_text,
            resume_url: content.data.resume_url
        };
    }
    return null;
}

// NEW: Load Hire Me Page Content
async function loadHireMeContent() {
    const content = await fetchMarkdownContent('content/pages/hireMe.md');
    if (content && content.data) {
        return {
            title: content.data.title,
            profile_photo: content.data.profile_photo,
            tagline: content.data.tagline,
            introduction: content.data.introduction,
            what_i_can_do: content.data.what_i_can_do,
            why_work_with_me: content.data.why_work_with_me,
            reach_out_guide: content.data.reach_out_guide,
            call_to_action: content.data.call_to_action,
            testimonials: content.data.testimonials || [] // This will load the inline testimonials
        };
    }
    return null;
}

// You might also need a loader for the tech icons library if you use it globally
async function loadTechIconsLibrary() {
    const content = await fetchMarkdownContent('content/assets/tech_icons_list.md');
    if (content && content.data && content.data.icons) {
        return content.data.icons;
    }
    return [];
}