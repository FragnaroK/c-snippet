function addKeysToObject(data: Array<any>, target: any): any {
    data.forEach((item) => {
        for (const key in item) {
            if (key in target) {
                target[key] = { ...target[key], ...item[key] };
            } else {
                target[key] = { ...item[key] };
            }
        }
    });

    return target;
}

export  {
    addKeysToObject,
};