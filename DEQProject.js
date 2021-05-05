const prompt = require('prompt-sync')({ sigint: true });

function dy(t, y) { return (t** 2 - y)/(y - 2*t)}
console.log("Running with ODE: dy/dt = (t** 2 - y)/(y - 2*t)\n")

function promptNum(header) {
    const num = prompt(`${header}: `);
    if (!num) {
        console.log("Please enter a number.");
        return promptNum(header);
    } else if (num.match(/[^0-9\.]/) || (num.match(/\./g) || []).length > 1) {
        console.log(`${header} must be a number. You entered: ${num}`);
        return promptNum(header);
    } else {
        return parseFloat(num);
    }
}

const ti = promptNum("Initial t");
const yi = promptNum("Initial y");

const step = promptNum("Step Size");
const iter = promptNum("Number of Iterations");

const steps = [];
const iters = [];

for (let i = 0; i < 7; i++) {
    steps.push(step / 2 ** i);
    iters.push(iter * 2 ** i);
}

function euler(dt, iter, ti, yi, __dy) {
    let t = ti;
    let y = yi;
    for (let i = 0; i < iter; i++) {
        y += dt * __dy(t, y);
        t += dt;
    }
    return y;
}

function improved(dt, iter, ti, yi, __dy) {
    let t = ti;
    let y = yi;
    for (let i = 0; i < iter; i++) {
        const m = __dy(t, y);
        const n = __dy(t + dt, y + dt * m);
        y += dt * (m + n) / 2;
        t += dt;
    }
    return y;
}

function runge(dt ,iter, ti, yi, __dy) {
    let t = ti;
    let y = yi;
    for (let i = 0; i < iter; i++) {
        const m = __dy(t, y);
        const n = __dy(t + dt/2, y + dt*m/2);
        const o = __dy(t + dt/2, y + dt*n/2);
        const p = __dy(t + dt, y + dt * o);
        y += dt * (m + 2*n + 2*o + p) / 6;
        t += dt;
    }
    return y;
}

function table(initT, initY) {    
    const approximations = {};
    const errorRatios = {};
    
    const approxEuler = [];
    const approxImproved = [];
    const approxRunge = [];

    steps.forEach((step, i) => {
        approxEuler.push(euler(step, iters[i], initT, initY, dy));
        approxImproved.push(improved(step, iters[i], initT, initY, dy));
        approxRunge.push(runge(step, iters[i], initT, initY, dy));
        
        approximations[i+1] = {
            "Step Size": step,
            "Euler": approxEuler[i],
            "Improved Euler": approxImproved[i],
            "Runge-Kutta": approxRunge[i]
        }

        if (i >= 2) {
            errorRatios[i+1] = {
                "Euler": (approxEuler[i-1] - approxEuler[i-2]) / (approxEuler[i] - approxEuler[i-1]),
                "Improved Euler": (approxImproved[i-1] - approxImproved[i-2])/(approxImproved[i]-approxImproved[i-1]),
                "Runge-Kutta": (approxRunge[i-1] - approxRunge[i-2])/(approxRunge[i]-approxRunge[i-1])
            };
        }
    })
    console.log(`------------------------------------- Approximations -------------------------------------`);
    console.table(approximations);
    console.log(`------------------------------ Error Ratios ------------------------------`);
    console.table(errorRatios);
}

table(ti, yi);