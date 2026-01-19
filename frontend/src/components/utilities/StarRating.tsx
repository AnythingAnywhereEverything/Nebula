export const ratingStars = (itemrating:number) => {
    const stars = [];
    for (let i = 0; i < Math.floor(itemrating); i++) {
        stars.push("");
    }
    if (itemrating % 1 >= 0) {
        stars.push("");
    }
    for (let i = stars.length; i < 5; i++) {
        stars.push("");
    }
    return stars.join("");
}