interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const TravelMode = (props: Props) => {
    const { onChange } = props;
    return (
        <div className="absolute fl my24 mx24 bg-gray-faint round">
            <form id="travel-mode-param">
                {/* <h4 className="txt-m txt-bold mb6">Choose a travel mode:</h4> */}
                <div className="mr12 toggle-group align-center">
                    <label className="toggle-container">
                        <input
                            name="profile"
                            type="radio"
                            value="walking"
                            onChange={(e) => onChange(e)}
                        />
                        <div className="toggle toggle--active-null toggle--null">
                            Walking
                        </div>
                    </label>
                    <label className="toggle-container">
                        <input
                            name="profile"
                            type="radio"
                            value="cycling"
                            onChange={(e) => onChange(e)}
                        />
                        <div className="toggle toggle--active-null toggle--null">
                            Cycling
                        </div>
                    </label>
                    <label className="toggle-container">
                        <input
                            name="profile"
                            type="radio"
                            value="driving"
                            onChange={(e) => onChange(e)}
                            // checked={true}
                        />
                        <div className="toggle toggle--active-null toggle--null">
                            Driving
                        </div>
                    </label>
                </div>
            </form>
        </div>
    );
};
