(function() {
    // Determine the base URL (domain) from current script tag
    const script = document.currentScript || document.querySelector('script[src*="embed/popup.js"]');
    const baseUrl = script ? new URL(script.src).origin : window.location.origin;

    window.LMSForms = {
        open: function(formId) {
            // Remove existing modal if any
            const existing = document.getElementById('lms-popup-modal-container');
            if (existing) {
                existing.remove();
            }

            // Create container
            const container = document.createElement('div');
            container.id = 'lms-popup-modal-container';
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'; // dark slate overlay
            container.style.backdropFilter = 'blur(4px)';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.zIndex = '999999';
            container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.2s ease';

            // Modal box
            const box = document.createElement('div');
            box.style.position = 'relative';
            box.style.width = '90%';
            box.style.maxWidth = '520px';
            box.style.height = '80vh';
            box.style.maxHeight = '700px';
            box.style.backgroundColor = '#ffffff';
            box.style.borderRadius = '16px';
            box.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            box.style.overflow = 'hidden';
            box.style.transform = 'scale(0.95)';
            box.style.transition = 'transform 0.2s ease';

            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&#x2715;'; // Close symbol (✕)
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '12px';
            closeBtn.style.right = '16px';
            closeBtn.style.width = '32px';
            closeBtn.style.height = '32px';
            closeBtn.style.borderRadius = '50%';
            closeBtn.style.border = 'none';
            closeBtn.style.backgroundColor = '#f1f5f9';
            closeBtn.style.color = '#64748b';
            closeBtn.style.fontSize = '14px';
            closeBtn.style.fontWeight = 'bold';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.display = 'flex';
            closeBtn.style.alignItems = 'center';
            closeBtn.style.justifyContent = 'center';
            closeBtn.style.zIndex = '10';
            closeBtn.style.transition = 'all 0.15s ease';

            closeBtn.onmouseover = function() {
                closeBtn.style.backgroundColor = '#e2e8f0';
                closeBtn.style.color = '#334155';
            };
            closeBtn.onmouseout = function() {
                closeBtn.style.backgroundColor = '#f1f5f9';
                closeBtn.style.color = '#64748b';
            };

            const closeModal = function() {
                container.style.opacity = '0';
                box.style.transform = 'scale(0.95)';
                setTimeout(function() {
                    container.remove();
                }, 200);
            };

            closeBtn.onclick = closeModal;
            container.onclick = function(e) {
                if (e.target === container) {
                    closeModal();
                }
            };

            // Iframe
            const iframe = document.createElement('iframe');
            iframe.src = `${baseUrl}/embed/form/${formId}`;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.display = 'block';

            // Append elements
            box.appendChild(closeBtn);
            box.appendChild(iframe);
            container.appendChild(box);
            document.body.appendChild(container);

            // Animate Open
            setTimeout(function() {
                container.style.opacity = '1';
                box.style.transform = 'scale(1)';
            }, 10);
        }
    };
})();
