export const makeRequest = async (baseUrl, token, endpoint, options = {}) => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error(`API Error for ${endpoint}:`, err);
        throw err;
    }
};

export const formatCurrency = (value) => {
    if (!value) return "0 so'm";
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
};

export const drawBarChart = (canvas, data, color = '#3b82f6') => {
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const maxValue = Math.max(...data.map((d) => d.value || 0));
    if (maxValue === 0) return;

    const barWidth = (chartWidth / data.length) * 0.8;
    const barSpacing = (chartWidth / data.length) * 0.2;

    data.forEach((item, index) => {
        const x = padding + index * (chartWidth / data.length) + barSpacing / 2;
        const barHeight = ((item.value || 0) / maxValue) * chartHeight;
        const y = padding + chartHeight - barHeight;

        // Draw bar
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw label
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth / 2, height - 10);

        // Draw value
        ctx.fillStyle = '#374151';
        ctx.font = '10px sans-serif';
        if (barHeight > 20) {
            ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
        }
    });
};
