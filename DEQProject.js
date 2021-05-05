function dy(t, y) { return (t** 2 - y)/(y - 2*t)}

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

const steps = ["1/5", "1/10", "1/20", "1/40", "1/80", "1/160", "1/320"];
const iters = [10, 20, 40, 80, 160, 320, 640];

function table(initT, initY, title){    
    let A = {};
    let B = {};

    steps.forEach((step, i) => {
        A[step] = {};
        A[step]["Euler"] = euler(eval(step), iters[i], initT, initY, dy);
        A[step]["Improved Euler"] = improved(eval(step), iters[i], initT, initY, dy);
        A[step]["Runge-Kutta"] = runge(eval(step), iters[i], initT, initY, dy);

        if (i >= 2) {
            B[i+1] = {};
            B[i+1]["Euler"] = (euler(eval(steps[i-1]),iters[i-1],initT, initY,dy) - euler(eval(steps[i-2]),iters[i-2],initT, initY,dy))/(euler(eval(steps[i]),iters[i],initT, initY,dy)-euler(eval(steps[i-1]),iters[i-1],initT, initY,dy));
            B[i+1]["Improved Euler"] = (improved(eval(steps[i-1]),iters[i-1],initT, initY,dy) - improved(eval(steps[i-2]),iters[i-2],initT, initY,dy))/(improved(eval(steps[i]),iters[i],initT, initY,dy)-improved(eval(steps[i-1]),iters[i-1],initT, initY,dy));
            B[i+1]["Runge-Kutta"] = (runge(eval(steps[i-1]),iters[i-1],initT, initY,dy) - runge(eval(steps[i-2]),iters[i-2],initT, initY,dy))/(runge(eval(steps[i]),iters[i],initT, initY,dy)-runge(eval(steps[i-1]),iters[i-1],initT, initY,dy));
        }
    })
    console.log(`------------------------------ ${title}A ------------------------------`);
    console.table(A);
    console.log(`------------------------------ ${title}B ------------------------------`);
    console.table(B);
}

table(1, 1, "1");
table(1, 3, "2");