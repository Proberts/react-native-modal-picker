'use strict';

import React,{
    PropTypes
} from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Modal,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';

import styles from './style';
import BaseComponent from './BaseComponent';

let componentIndex = 0;

const propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    initValue: PropTypes.string,
    style: View.propTypes.style,
    selectStyle: View.propTypes.style,
    optionContainerStyle: View.propTypes.style,
    optionStyle: View.propTypes.style,
    optionTextStyle: Text.propTypes.style,
    optionNumberOfLines: PropTypes.number,
    optionEllipsizeMode: PropTypes.oneOf(['head', 'middle', 'tail', 'clip']),
    sectionStyle: View.propTypes.style,
    sectionTextStyle: Text.propTypes.style,
    cancelStyle: View.propTypes.style,
    cancelTextStyle: Text.propTypes.style,
    overlayStyle: View.propTypes.style,
    cancelText: PropTypes.string
};

const defaultProps = {
    data: [],
    onChange: ()=> {},
    onClose: ()=> {},
    initValue: 'Select me!',
    style: {},
    selectStyle: {},
    optionContainerStyle: {},
    optionStyle: {},
    optionTextStyle: {},
    optionNumberOfLines: undefined,
    optionEllipsizeMode: 'tail',
    sectionStyle: {},
    sectionTextStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    cancelText: 'cancel'
};

export default class ModalPicker extends BaseComponent {

    constructor() {

        super();

        this._bind(
            'onChange',
            'open',
            'close',
            'renderChildren'
        );

        this.state = {
            animationType: 'none',
            modalVisible: false,
            transparent: false,
            selected: 'please select',
            selectedObject: {},
        };
    }

    componentDidMount() {
        this.setState({selected: this.props.initValue});
        this.setState({cancelText: this.props.cancelText});
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.initValue != this.props.initValue) {
        this.setState({selected: nextProps.initValue});
      }
    }


    onChange(item) {
        this.props.onChange(item);
        this.setState({selected: item.label, selectedObject: item});
        this.close(item);
    }

    close(result) {
      this.setState({
        modalVisible: false
      });
      this.props.onClose(result);
    }

    open() {
      this.setState({
        modalVisible: true
      });
    }

    renderSection(section) {
        return (
            <View key={section.key} style={[styles.sectionStyle,this.props.sectionStyle]}>
                <Text style={[styles.sectionTextStyle,this.props.sectionTextStyle]}>{section.label}</Text>
            </View>
        );
    }

    renderOption(option) {
        return (
            <TouchableOpacity key={option.key} onPress={()=>this.onChange(option)}>
                <View style={[styles.optionStyle, this.props.optionStyle]}>
                    <Text numberOfLines={this.props.optionNumberOfLines}
                      ellipsizeMode={this.props.optionEllipsizeMode}
                      style={[styles.optionTextStyle,this.props.optionTextStyle]}>{option.label}</Text>
                </View>
            </TouchableOpacity>)
    }

    renderOptionList() {
        var options = this.props.data.map((item) => {
            if (item.section) {
                return this.renderSection(item);
            } else {
                return this.renderOption(item);
            }
        });

        return (

            <View style={[styles.overlayStyle, this.props.overlayStyle]} key={'modalPicker'+(componentIndex++)}>
                <View style={[styles.optionContainer, this.props.optionContainerStyle]}>
                    <ScrollView keyboardShouldPersistTaps='always'>
                        <View style={{paddingHorizontal:10}}>
                            {options}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.cancelContainer}>
                    <TouchableOpacity onPress={() => this.close(null)}>
                        <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                            <Text style={[styles.cancelTextStyle,this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>);
    }

    renderChildren() {

        if(this.props.children) {
            return this.props.children;
        }
        return (
            <View style={[styles.selectStyle, this.props.selectStyle]}>
                <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selected}</Text>
            </View>
        );
    }

    render() {

        const dp = (
          <Modal transparent={true} ref="modal" visible={this.state.modalVisible} onRequestClose={this.close} animationType={this.state.animationType}>
          {this.renderOptionList()}
          </Modal>
        );

        return (
            <View style={this.props.style}>
                {dp}
                <TouchableOpacity onPress={this.open}>
                    {this.renderChildren()}
                </TouchableOpacity>
            </View>
        );
    }
}

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;
