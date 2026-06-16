(function() {
    const script = document.currentScript || document.querySelector('script[src*="embed/loader.js"]');
    if (!script) return;
    const formId = script.getAttribute('data-form');
    const targetId = script.getAttribute('data-target') || `lms-form-${formId}`;
    const target = document.getElementById(targetId);
    if (!target) return;

    // Determine the API base URL (Backend Port 5001)
    const apiBase = "http://localhost:5001/api/v1";

    // Fetch form
    fetch(`${apiBase}/form/public/get-form/${formId}`)
        .then(res => {
            if (!res.ok) throw new Error("Form not found");
            return res.json();
        })
        .then(form => {
            renderForm(target, form, apiBase);
        })
        .catch(err => {
            console.error("LMS Form Loader Error:", err);
            target.innerHTML = `<div style="color: #ef4444; font-family: sans-serif; font-size: 14px;">Failed to load form.</div>`;
        });

    function renderForm(container, form, apiUrl) {
        const fields = form.fields || [];
        let html = `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 800; color: #1e293b;">${form.name}</h3>
                <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">Please fill out the form below.</p>
                <form id="lms-submit-form-${form.id}" style="display: flex; flex-direction: column; gap: 16px;">
        `;

        fields.forEach(field => {
            const requiredAst = field.required ? '<span style="color: #ef4444; margin-left: 4px;">*</span>' : '';
            html += `<div style="display: flex; flex-direction: column; gap: 6px; text-align: left;">
                <label style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">${field.label}${requiredAst}</label>`;

            if (field.type === 'select') {
                html += `<select name="${field.label}" ${field.required ? 'required' : ''} style="height: 38px; padding: 0 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #334155; background: #ffffff; outline: none; box-sizing: border-box; width: 100%;">
                    <option value="">${field.placeholder || 'Select option...'}</option>`;
                (field.options || []).forEach(opt => {
                    const val = typeof opt === 'object' && opt !== null ? (opt.value !== undefined ? opt.value : opt.label) : opt;
                    const label = typeof opt === 'object' && opt !== null ? (opt.label !== undefined ? opt.label : opt.value) : opt;
                    html += `<option value="${val}">${label}</option>`;
                });
                html += `</select>`;
            } else if (field.type === 'radio') {
                html += `<div style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px;">`;
                (field.options || []).forEach(opt => {
                    const val = typeof opt === 'object' && opt !== null ? (opt.value !== undefined ? opt.value : opt.label) : opt;
                    const label = typeof opt === 'object' && opt !== null ? (opt.label !== undefined ? opt.label : opt.value) : opt;
                    html += `<label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #475569; cursor: pointer;">
                        <input type="radio" name="${field.label}" value="${val}" ${field.required ? 'required' : ''} style="accent-color: #0284c7; margin: 0;" />
                        <span>${label}</span>
                    </label>`;
                });
                html += `</div>`;
            } else if (field.type === 'checkbox') {
                html += `<div style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px;">`;
                (field.options || []).forEach(opt => {
                    const val = typeof opt === 'object' && opt !== null ? (opt.value !== undefined ? opt.value : opt.label) : opt;
                    const label = typeof opt === 'object' && opt !== null ? (opt.label !== undefined ? opt.label : opt.value) : opt;
                    html += `<label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #475569; cursor: pointer;">
                        <input type="checkbox" name="${field.label}" value="${val}" style="accent-color: #0284c7; margin: 0;" />
                        <span>${label}</span>
                    </label>`;
                });
                html += `</div>`;
            } else {
                const inputType = field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text';
                html += `<input type="${inputType}" name="${field.label}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="height: 38px; padding: 0 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #334155; outline: none; box-sizing: border-box; width: 100%;" />`;
            }
            html += `</div>`;
        });

        html += `
                    <button type="submit" style="height: 40px; margin-top: 8px; background: #0284c7; color: #ffffff; font-weight: 700; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.2s;">Submit</button>
                </form>
            </div>
        `;

        container.innerHTML = html;

        const formEl = container.querySelector(`#lms-submit-form-${form.id}`);

        // Hover effect on submit button
        const btn = formEl.querySelector('button[type="submit"]');
        btn.onmouseover = () => btn.style.background = '#0369a1';
        btn.onmouseout = () => btn.style.background = '#0284c7';

        // Add submission listener
        formEl.addEventListener('submit', function(e) {
            e.preventDefault();
            btn.disabled = true;
            btn.innerText = "Submitting...";

            const payload = {};
            const formData = new FormData(formEl);

            // Handle multi-select checkboxes
            fields.forEach(field => {
                if (field.type === 'checkbox') {
                    payload[field.label] = formData.getAll(field.label);
                } else {
                    payload[field.label] = formData.get(field.label);
                }
            });

            fetch(`${apiUrl}/form/public/submit/${form.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if (!res.ok) throw new Error("Submission failed");
                return res.json();
            })
            .then(data => {
                container.innerHTML = `
                    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: center; box-sizing: border-box;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: #ecfdf5; border: 1px solid #d1fae5; color: #059669; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 24px; font-weight: bold;">✓</div>
                        <h3 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 800; color: #1e293b;">Thank you!</h3>
                        <p style="margin: 0; font-size: 13px; color: #64748b;">Your submission has been received successfully.</p>
                    </div>
                `;
            })
            .catch(err => {
                console.error(err);
                alert("Failed to submit form. Please try again.");
                btn.disabled = false;
                btn.innerText = "Submit";
            });
        });
    }
})();
