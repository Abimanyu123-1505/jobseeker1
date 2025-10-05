renderCurrentCard() {
    this.container.innerHTML = '';
    
    if (this.jobs.length === 0) {
        this.showEmptyState();
        return;
    }

    // Create and add NEXT card first (so it's behind)
    if (this.jobs.length > 1) {
        const nextJob = this.jobs[1];
        const nextCard = this.createJobCard(nextJob);
        nextCard.classList.add('next-card');
        
        // Make next card non-interactive
        nextCard.style.pointerEvents = 'none';
        
        this.container.appendChild(nextCard);
    }

    // Create and add CURRENT card (on top)
    const currentJob = this.jobs[0];
    const cardElement = this.createJobCard(currentJob);
    
    this.activeCard = new SwipeCard(cardElement, currentJob, {
        left: (job) => this.handleSwipe(job, 'pass'),
        right: (job) => this.handleSwipe(job, 'apply'),
        up: (job) => this.handleSwipe(job, 'save')
    });
    
    this.container.appendChild(cardElement);
}






Swipe.js la ida change pannu
