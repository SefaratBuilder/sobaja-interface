import React from 'react'
import styled from 'styled-components'
import SettingIcon from 'assets/icons/setting.svg'

const Setting = () => {
    return (
        <SettingWrapper>
            <img
                className="setting-icon"
                alt="setting icon"
                src={SettingIcon}
            />
        </SettingWrapper>
    )
}

const SettingWrapper = styled.div`
    position: relative;
    max-width: 30px;
`

export default Setting
