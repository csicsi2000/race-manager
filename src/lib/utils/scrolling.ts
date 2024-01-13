export function scrollToBottom(node:HTMLElement){
    node.scrollTo({
        top: node.scrollHeight - 100,
        behavior: 'smooth',        
    });
    node.scrollBy({
        top: node.scrollHeight - 100,
        behavior: 'smooth',
        
    });
    return { update: scroll }
};