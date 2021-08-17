import { useState } from "react";

interface Props {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rangeval: number;
}
export const RangeSlider = (props: Props) => {
    return (
        <>
            <div style={{ color: "white", marginLeft: "1em" }}>
                {props.rangeval} seconds
            </div>
            <div>
                <input
                    type="range"
                    className="custom-range"
                    min={1}
                    max={120}
                    step={1}
                    defaultValue={5}
                    onChange={(event) => props.onChange(event)}
                />
            </div>
        </>
    );
};

export default RangeSlider;
