export let channels = [];

export const length = channels.length; // If you want to export the length

export const push = (channel) => {
    channels.push(channel);
};
