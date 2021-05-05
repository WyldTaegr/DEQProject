function dy(t, y) { return (t** 2 - y)/(y - 2*t)}

const ti = 1;
const yi = 3;

const step = 0.2;
const iter = 10;

const steps = [];
const iters = [];

for (let i = 0; i < 4; i++) {
    steps.push(step / 2 ** i);
    iters.push(iter * 2 ** i);
}

steps.forEach((step, iter) => {
    const A = [];
    let t = ti;
    let y = yi;
    for (let i = 0; i < iters[iter]; i++) {
        y += step * dy(t, y);
        t += step;
        A.push({"t": t, "y": y});
    }
    console.table(A);
})

